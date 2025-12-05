import { Request, Response } from 'express';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadUserDocs = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    // File will be available as req.file (single file upload)
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    // Placeholder for Appwrite upload logic
    // const appwriteResponse = await appwriteClient.uploadFile(req.file);
    // Save file metadata to DB if needed
    res.status(201).json({ message: 'File uploaded successfully', file: req.file });
    return;
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
    return;
  }
}; 