import { Request, Response } from 'express';
import { getAvailabilityByDoctorId, setAvailabilityByDoctorId } from '../models/doctorAvailabilityModel';

export const getAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slots = await getAvailabilityByDoctorId(id);
    res.json(slots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

export const setAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { slots } = req.body; // slots: [{ available_day, start_time, end_time }]
    if (!Array.isArray(slots)) {
      res.status(400).json({ error: 'slots must be an array' });
      return;
    }
    const result = await setAvailabilityByDoctorId(id, slots);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error setting availability:', error);
    res.status(500).json({ error: 'Failed to set availability' });
  }
}; 