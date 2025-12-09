// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { google } from 'googleapis'
import User from '../models/User.js'

// ============================
//  CONFIG OAUTH2 GOOGLE
// ============================
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

// função helper pra gerar JWT sempre igual
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar || '',
    },
    process.env.JWT_SECRET || 'changeme',
    { expiresIn: '8h' },
  )
}

// ============================
// ✅ REGISTER (e-mail + senha)
// ============================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email e password são obrigatórios' })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ error: 'E-mail já cadastrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'user',
      avatar: '', // cadastro normal não tem foto ainda
    })

    const token = generateToken(user)

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
      },
    })
  } catch (err) {
    console.error('Erro register:', err)
    return res.status(400).json({ error: err.message })
  }
}

// ============================
// ✅ LOGIN NORMAL (e-mail + senha)
// ============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'email e password são obrigatórios' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = generateToken(user)

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || '',
      },
    })
  } catch (err) {
    console.error('Erro login:', err)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

// ============================
// ✅ GOOGLE LOGIN - PASSO 1
// GET /api/auth/google
// ============================
export const googleAuth = (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ]

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  })

  return res.redirect(url)
}

// ============================
// ✅ GOOGLE LOGIN - PASSO 2 (callback)
// GET /api/auth/google/callback
// ============================
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query

    if (!code) {
      return res.status(400).send('Código não informado pelo Google')
    }

    // troca "code" por tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // pega dados do usuário
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    })

    const { data } = await oauth2.userinfo.get()
    const { email, name, picture } = data

    if (!email) {
      return res.status(400).send('Não foi possível obter e-mail da conta Google')
    }

    let user = await User.findOne({ email })

    if (!user) {
      const fakeHash = await bcrypt.hash('google_user', 10)

      user = await User.create({
        name: name || 'Usuário Google',
        email,
        passwordHash: fakeHash,
        role: 'user',
        avatar: picture || '',
      })
    } else {
      // atualiza foto se vier uma nova
      if (picture && user.avatar !== picture) {
        user.avatar = picture
        await user.save()
      }
    }

    const token = generateToken(user)

    // redireciona de volta pro FRONT com token, nome e avatar
    const redirectUrl =
      `http://localhost:5173/login` +
      `?googleToken=${encodeURIComponent(token)}` +
      `&name=${encodeURIComponent(user.name)}` +
      `&avatar=${encodeURIComponent(user.avatar || '')}`

    return res.redirect(redirectUrl)
  } catch (err) {
    console.error('Erro Google Callback:', err)
    return res.status(500).send('Erro no login com Google')
  }
}