import { Router } from 'express'
import {
  getAllMaintenances,
  createMaintenance,
  getMaintenanceById,
  updateMaintenance,
  updateMaintenanceStatus,
  deleteMaintenance,
} from '../controllers/maintenanceController.js'

const router = Router()

router.get('/', getAllMaintenances)
router.post('/', createMaintenance)
router.get('/:id', getMaintenanceById)
router.put('/:id', updateMaintenance)
router.patch('/:id', updateMaintenanceStatus)
router.delete('/:id', deleteMaintenance)

export default router