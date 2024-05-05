import express from 'express';
import { createMovement, updateMovement, deleteMovement } from '../controllers/MovementController';

const router = express.Router();

router.post('/create', createMovement);
router.put('/update/:id', updateMovement);
router.delete('/delete/:id', deleteMovement);

export default router;
