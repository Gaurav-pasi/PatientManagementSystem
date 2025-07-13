import { Request, Response } from 'express';
import { getFileById } from '../models/fileModel';

export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = await getFileById(id);
    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    // For download, you might want to redirect or send the file_url
    res.json({ file_url: file.file_url, file_name: file.file_name });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
}; 