import Maintenance from '../models/Maintenance.js'

// ✅ LISTAR TODAS AS MANUTENÇÕES
export const getAllMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find().sort({ createdAt: -1 })
    res.json(maintenances)
  } catch (err) {
    console.error('Erro ao buscar manutenções:', err)
    res.status(500).json({ error: 'Erro ao buscar manutenções' })
  }
}

// ✅ CRIAR NOVA MANUTENÇÃO (AQUI ESTAVA O ERRO)
export const createMaintenance = async (req, res) => {
  try {
    console.log('📥 POST /maintenances body:', req.body)

    const {
      title,
      machineName,
      sector,
      technician,
      type,
      priority,
      scheduledDate,
      description,
      status,
    } = req.body

    const maintenance = await Maintenance.create({
      title,
      machineName,
      sector,
      technician,
      type,
      priority,
      scheduledDate,
      description,
      status: status || 'pendente',
    })

    return res.status(201).json(maintenance)
  } catch (err) {
    console.error('Erro ao criar manutenção:', err)
    return res.status(400).json({ error: err.message })
  }
}

// ✅ BUSCAR UMA MANUTENÇÃO PELO ID
export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)

    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada' })
    }

    res.json(maintenance)
  } catch (err) {
    console.error('Erro ao buscar manutenção:', err)
    res.status(500).json({ error: 'Erro ao buscar manutenção' })
  }
}

// ✅ EDITAR MANUTENÇÃO COMPLETA (BOTÃO EDITAR)
export const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada' })
    }

    res.json(maintenance)
  } catch (err) {
    console.error('Erro ao editar manutenção:', err)
    return res.status(400).json({ error: err.message })
  }
}

// ✅ ATUALIZAR APENAS STATUS (BOTÕES: EM ANDAMENTO / FINALIZAR)
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body

    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada' })
    }

    res.json(maintenance)
  } catch (err) {
    console.error('Erro ao atualizar status:', err)
    return res.status(400).json({ error: err.message })
  }
}

// ✅ EXCLUIR MANUTENÇÃO
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id)

    if (!maintenance) {
      return res.status(404).json({ error: 'Manutenção não encontrada' })
    }

    res.json({ message: 'Manutenção excluída com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir manutenção:', err)
    res.status(500).json({ error: 'Erro ao excluir manutenção' })
  }
}