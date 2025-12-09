// backend/src/utils/db.js
import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.error('❌ ERRO: variável MONGO_URI não definida.')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB conectado!')
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message)
    process.exit(1)
  }
}