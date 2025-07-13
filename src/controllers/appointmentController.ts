import { Request, Response } from 'express';
import { createAppointment, getAllAppointments, getAppointmentById, updateAppointmentById, deleteAppointmentById } from '../models/appointmentModel';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
    return;
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
    return;
  }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await getAllAppointments();
    res.json(appointments);
    return;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
    return;
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);
    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json(appointment);
    return;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
    return;
  }
};

export const updateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await updateAppointmentById(id, req.body);
    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json(appointment);
    return;
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
    return;
  }
};

export const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await deleteAppointmentById(id);
    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json({ message: 'Appointment cancelled', appointment });
    return;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
    return;
  }
}; 