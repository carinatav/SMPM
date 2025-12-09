// src/controllers/machineController.js
const Machine = require('../models/Machine')

// GET /api/machines
exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ name: 1 })
    res.json(machines)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao listar máquinas' })
  }
}

// GET /api/machines/:id
exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id)
    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' })
    }
    res.json(machine)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar máquina' })
  }
}

// POST /api/machines
exports.createMachine = async (req, res) => {
  try {
    const machine = await Machine.create(req.body)
    res.status(201).json(machine)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Erro ao criar máquina' })
  }
}

// PUT /api/machines/:id
exports.updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' })
    }
    res.json(machine)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Erro ao atualizar máquina' })
  }
}

// DELETE /api/machines/:id
exports.deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id)
    if (!machine) {
      return res.status(404).json({ message: 'Máquina não encontrada' })
    }
    res.json({ message: 'Máquina excluída com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao excluir máquina' })
  }
}