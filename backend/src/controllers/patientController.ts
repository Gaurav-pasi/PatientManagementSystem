import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, updatePatientById as updatePatientByIdModel, getPatientById as getPatientByIdModel } from '../models/userModel';
import { handleDatabaseError, sendErrorResponse } from '../utils/errors';
import { PG_ERROR_CODES } from '../types';

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, password, phone_number, gender, dob } = req.body;
    if (!full_name || !email || !password) {
      res.status(400).json({ error: 'full_name, email, and password are required' });
      return;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({
      full_name,
      email,
      password_hash,
      phone_number,
      gender,
      dob,
      role: 'patient',
    });
    res.status(201).json(user);
    return;
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    console.error('Error creating patient:', error);
    sendErrorResponse(res, handleDatabaseError(error));
    return;
  }
};

export const updatePatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { full_name, email, phone_number, gender, dob } = req.body;
    const patient = await updatePatientByIdModel(id, {
      full_name,
      email,
      phone_number,
      gender,
      dob,
    });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(patient);
    return;
  } catch (error: unknown) {
    const dbError = error as { code?: string };
    if (dbError.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    console.error('Error updating patient by id:', error);
    sendErrorResponse(res, handleDatabaseError(error));
    return;
  }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const patient = await getPatientByIdModel(id);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(patient);
    return;
  } catch (error) {
    console.error('Error fetching patient by id:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
    return;
  }
}; 