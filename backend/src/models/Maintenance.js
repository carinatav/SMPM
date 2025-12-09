// backend/src/models/Maintenance.js
import mongoose from 'mongoose'

const maintenanceSchema = new mongoose.Schema(
  {
    title: { type: String },              // título da manutenção
    machineName: { type: String },        // nome da máquina (texto mesmo)
    sector: { type: String },             // setor
    technician: { type: String },         // técnico responsável
    type: { type: String },               // preventiva / corretiva
    priority: { type: String },           // baixa / média / alta
    status: {
      type: String,
      default: 'pendente',               // pendente / em_andamento / concluida
    },
    scheduledDate: { type: String },      // formato yyyy-mm-dd vindo do form
    description: { type: String },        // texto livre
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Maintenance', maintenanceSchema)