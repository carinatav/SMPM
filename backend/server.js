// backend/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './src/utils/db.js'

import swaggerUi from 'swagger-ui-express'
import fs from 'fs'

import authRoutes from './src/routes/auth.js'
import maintenanceRoutes from './src/routes/maintenances.js'
import machineRoutes from './src/routes/machines.js'

const app = express()

app.use(cors())
app.use(express.json())

// ------- Swagger UI -------
const swaggerDocument = JSON.parse(
  fs.readFileSync('./swagger_output.json', 'utf-8')
)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// --------------------------
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