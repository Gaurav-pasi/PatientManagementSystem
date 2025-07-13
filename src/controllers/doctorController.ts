import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser, getDoctors as getDoctorsModel, getDoctorById as getDoctorByIdModel, updateDoctorById as updateDoctorByIdModel } from '../models/userModel';

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
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
      role: 'doctor',
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      console.error('Error creating doctor:', error);
      res.status(500).json({ error: 'Failed to create doctor' });
    }
  }
};

export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await getDoctorsModel();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctor = await getDoctorByIdModel(id);
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by id:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

export const updateDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { full_name, email, phone_number, gender, dob } = req.body;
    const doctor = await updateDoctorByIdModel(id, {
      full_name,
      email,
      phone_number,
      gender,
      dob,
    });
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' });
      return;
    }
    res.json(doctor);
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      console.error('Error updating doctor by id:', error);
      res.status(500).json({ error: 'Failed to update doctor' });
    }
  }
}; 