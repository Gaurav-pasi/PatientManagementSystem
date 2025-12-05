import request from 'supertest';
import app from '../index';

describe('Patient Management System API', () => {
  let patientId: string;
  let doctorId: string;
  let appointmentId: string;
  const unique = Date.now();
  const patientEmail = `john.doe.${unique}@example.com`;
  const doctorEmail = `jane.smith.${unique}@hospital.com`;

  // PATIENT
  it('should create a patient', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        full_name: 'John Doe',
        email: patientEmail,
        password: 'password123',
        phone_number: '1234567890',
        gender: 'male',
        dob: '1990-01-01'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    patientId = res.body.id;
  }, 20000);

  it('should get the created patient', async () => {
    if (!patientId) throw new Error('No patientId from previous test');
    const res = await request(app).get(`/patients/${patientId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', patientEmail);
  });

  // DOCTOR
  it('should create a doctor', async () => {
    const res = await request(app)
      .post('/doctors')
      .send({
        full_name: 'Dr. Jane Smith',
        email: doctorEmail,
        password: 'doctor123',
        phone_number: '9876543210',
        gender: 'female',
        dob: '1985-05-15'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    doctorId = res.body.id;
  });

  it('should get all doctors', async () => {
    const res = await request(app).get('/doctors');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get the created doctor', async () => {
    if (!doctorId) throw new Error('No doctorId from previous test');
    const res = await request(app).get(`/doctors/${doctorId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', doctorEmail);
  });

  // DOCTOR AVAILABILITY
  it('should set doctor availability', async () => {
    if (!doctorId) throw new Error('No doctorId from previous test');
    const res = await request(app)
      .post(`/doctors/${doctorId}/availability`)
      .send({
        slots: [
          { available_day: 'Monday', start_time: '09:00:00', end_time: '12:00:00' },
          { available_day: 'Wednesday', start_time: '14:00:00', end_time: '17:00:00' }
        ]
      });
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get doctor availability', async () => {
    if (!doctorId) throw new Error('No doctorId from previous test');
    const res = await request(app).get(`/doctors/${doctorId}/availability`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // APPOINTMENT
  it('should create an appointment', async () => {
    if (!patientId || !doctorId) throw new Error('Missing patientId or doctorId from previous test');
    const res = await request(app)
      .post('/appointments')
      .send({
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_time: '2024-06-01T10:00:00Z',
        notes: 'Regular checkup'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    appointmentId = res.body.id;
  });

  it('should get all appointments', async () => {
    const res = await request(app).get('/appointments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get the created appointment', async () => {
    if (!appointmentId) throw new Error('No appointmentId from previous test');
    const res = await request(app).get(`/appointments/${appointmentId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', appointmentId);
  });

  it('should update the appointment', async () => {
    if (!appointmentId) throw new Error('No appointmentId from previous test');
    const res = await request(app)
      .put(`/appointments/${appointmentId}`)
      .send({ appointment_time: '2024-06-01T11:00:00Z', status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'confirmed');
  });

  it('should delete the appointment', async () => {
    if (!appointmentId) throw new Error('No appointmentId from previous test');
    const res = await request(app).delete(`/appointments/${appointmentId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Appointment cancelled');
  });
}); 