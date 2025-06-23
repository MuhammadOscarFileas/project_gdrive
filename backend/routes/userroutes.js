import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  updateUser,
  deleteUser,
} from '../controller/usercontroller.js';
import { verifyToken } from '../middleware/verifytoken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', refreshToken);
router.put('/edit', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);

export default router;
