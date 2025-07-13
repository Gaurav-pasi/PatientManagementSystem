import { Router } from 'express';
import { getFile } from '../controllers/fileController';

const router = Router();

/**
 * @swagger
 * /users/uploads/{id}:
 *   get:
 *     summary: Get uploaded file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: File ID
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/users/uploads/:id', getFile);

export default router; 