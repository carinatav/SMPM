// backend/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './src/utils/db.js'

import authRoutes from './src/routes/auth.js'
import maintenanceRoutes from './src/routes/maintenances.js'
import machineRoutes from './src/routes/machines.js'

const app = express()

app.use(cors())
app.use(express.json())

// Rotas da API
app.use('/api/auth', authRoutes)
app.use('/api/maintenances', maintenanceRoutes)
app.use('/api/machines', machineRoutes)

// Rota simples pra testar
app.get('/', (req, res) => {
  res.json({ message: 'API SMPM rodando' })
})

const PORT = process.env.PORT || 4000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
})