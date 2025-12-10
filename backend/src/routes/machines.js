// backend/src/routes/machines.js
import { Router } from 'express'
import {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} from '../controllers/machineController.js'

const router = Router()

// Listar todas as máquinas
router.get('/', getMachines)

// Buscar máquina por ID
router.get('/:id', getMachineById)

// Criar nova máquina
router.post('/', createMachine)

// Atualizar máquina
router.put('/:id', updateMachine)

// Deletar máquina
router.delete('/:id', deleteMachine)

export default router