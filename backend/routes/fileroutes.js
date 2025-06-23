import express from 'express';
import multer from 'multer';
import {
  createFile,
  updateFilename,
  getFiles,
  getFilePreview,
  downloadFile,
  deleteFile,
  getSharedFile,
} from '../controller/filecontroller.js';
import { verifyToken } from '../middleware/verifytoken.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Upload langsung dari buffer

// Hanya user login bisa CRUD file sendiri
router.post('/', verifyToken, upload.single('file'), createFile);
router.put('/:id', verifyToken, updateFilename);
router.get('/', verifyToken, getFiles);
router.get('/preview/:id', verifyToken, getFilePreview);
router.get('/download/:id', verifyToken, downloadFile);
router.delete('/:id', verifyToken, deleteFile);

// Akses file publik via share_id (tanpa login)
router.get('/share/:shareId', getSharedFile);

export default router;
