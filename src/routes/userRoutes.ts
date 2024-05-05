import express from 'express';
import { createUser, loginUser } from '../controllers/UserController';

const router = express.Router();

router.post('/cadastro', createUser);
router.post('/login', loginUser);

export default router;
