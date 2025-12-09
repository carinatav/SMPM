// src/routes/machines.js
const express = require('express')
const router = express.Router()

const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require('../controllers/machineController')

// se quiser proteger com JWT, descomenta a linha abaixo
// const { authMiddleware } = require('../middleware/authMiddleware')

// e usa authMiddleware nas rotas (exemplo):
// router.get('/', authMiddleware, getMachines)

router.get('/', getMachines)
router.get('/:id', getMachineById)
router.post('/', createMachine)
router.put('/:id', updateMachine)
router.delete('/:id', deleteMachine)

module.exports = router