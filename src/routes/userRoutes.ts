import { Router } from 'express';
import multer from 'multer';
import { uploadUserDocs } from '../controllers/userController';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Store files in uploads/ directory

router.post('/upload', upload.single('file'), uploadUserDocs);

export default router; 