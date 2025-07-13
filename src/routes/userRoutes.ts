import { Router } from 'express';
import multer from 'multer';
import { uploadUserDocs } from '../controllers/userController';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Store files in uploads/ directory

/**
 * @swagger
 * /users/upload:
 *   post:
 *     summary: Upload user documents
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 filename:
 *                   type: string
 *                   description: Name of the uploaded file
 *       400:
 *         description: No file provided
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('file'), uploadUserDocs);

export default router; 