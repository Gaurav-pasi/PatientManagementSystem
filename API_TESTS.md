# Patient Management System - API Test Cases

## Base URL: `http://localhost:3000`

---

## 1. PATIENT ENDPOINTS

### 1.1 POST `/patients` - Create Patient

**Valid Request:**
```bash
curl -X POST http://localhost:3000/patients \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "phone_number": "1234567890",
    "gender": "male",
    "dob": "1990-01-01"
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid-here",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "1234567890",
  "gender": "male",
  "dob": "1990-01-01T00:00:00.000Z",
  "role": "patient",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Validation Error (400):**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Full name is required",
      "path": "full_name",
      "location": "body"
    }
  ]
}
```

**Email Already Exists (409):**
```json
{
  "error": "Email already exists"
}
```

### 1.2 GET `/patients/:id` - Get Patient by ID

**Valid Request:**
```bash
curl -X GET http://localhost:3000/patients/uuid-here
```

**Expected Response (200):**
```json
{
  "id": "uuid-here",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "1234567890",
  "gender": "male",
  "dob": "1990-01-01T00:00:00.000Z",
  "role": "patient",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Not Found (404):**
```json
{
  "error": "Patient not found"
}
```

### 1.3 PUT `/patients/:id` - Update Patient

**Valid Request:**
```bash
curl -X PUT http://localhost:3000/patients/uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone_number": "9876543210"
  }'
```

**Expected Response (200):**
```json
{
  "id": "uuid-here",
  "full_name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone_number": "9876543210",
  "gender": "male",
  "dob": "1990-01-01T00:00:00.000Z",
  "role": "patient",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T01:00:00.000Z"
}
```

---

## 2. DOCTOR ENDPOINTS

### 2.1 POST `/doctors` - Create Doctor

**Valid Request:**
```bash
curl -X POST http://localhost:3000/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Jane Smith",
    "email": "jane.smith@hospital.com",
    "password": "doctor123",
    "phone_number": "9876543210",
    "gender": "female",
    "dob": "1985-05-15"
  }'
```

**Expected Response (201):**
```json
{
  "id": "doctor-uuid",
  "full_name": "Dr. Jane Smith",
  "email": "jane.smith@hospital.com",
  "phone_number": "9876543210",
  "gender": "female",
  "dob": "1985-05-15T00:00:00.000Z",
  "role": "doctor",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### 2.2 GET `/doctors` - Get All Doctors

**Valid Request:**
```bash
curl -X GET http://localhost:3000/doctors
```

**Expected Response (200):**
```json
[
  {
    "id": "doctor-uuid-1",
    "full_name": "Dr. Jane Smith",
    "email": "jane.smith@hospital.com",
    "phone_number": "9876543210",
    "gender": "female",
    "dob": "1985-05-15T00:00:00.000Z",
    "role": "doctor",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "doctor-uuid-2",
    "full_name": "Dr. Aryan Mehta",
    "email": "aryan.mehta@hospital.com",
    "phone_number": "9876543210",
    "gender": "male",
    "dob": "1982-05-10T00:00:00.000Z",
    "role": "doctor",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2.3 GET `/doctors/:id` - Get Doctor by ID

**Valid Request:**
```bash
curl -X GET http://localhost:3000/doctors/doctor-uuid
```

**Expected Response (200):**
```json
{
  "id": "doctor-uuid",
  "full_name": "Dr. Jane Smith",
  "email": "jane.smith@hospital.com",
  "phone_number": "9876543210",
  "gender": "female",
  "dob": "1985-05-15T00:00:00.000Z",
  "role": "doctor",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### 2.4 PUT `/doctors/:id` - Update Doctor

**Valid Request:**
```bash
curl -X PUT http://localhost:3000/doctors/doctor-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Jane Smith Updated",
    "email": "jane.updated@hospital.com",
    "phone_number": "1234567890"
  }'
```

**Expected Response (200):**
```json
{
  "id": "doctor-uuid",
  "full_name": "Dr. Jane Smith Updated",
  "email": "jane.updated@hospital.com",
  "phone_number": "1234567890",
  "gender": "female",
  "dob": "1985-05-15T00:00:00.000Z",
  "role": "doctor",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T01:00:00.000Z"
}
```

---

## 3. DOCTOR AVAILABILITY ENDPOINTS

### 3.1 GET `/doctors/:id/availability` - Get Doctor Availability

**Valid Request:**
```bash
curl -X GET http://localhost:3000/doctors/doctor-uuid/availability
```

**Expected Response (200):**
```json
[
  {
    "id": "availability-uuid-1",
    "available_day": "Monday",
    "start_time": "09:00:00",
    "end_time": "12:00:00"
  },
  {
    "id": "availability-uuid-2",
    "available_day": "Wednesday",
    "start_time": "14:00:00",
    "end_time": "17:00:00"
  }
]
```

### 3.2 POST `/doctors/:id/availability` - Set Doctor Availability

**Valid Request:**
```bash
curl -X POST http://localhost:3000/doctors/doctor-uuid/availability \
  -H "Content-Type: application/json" \
  -d '{
    "slots": [
      {
        "available_day": "Monday",
        "start_time": "09:00:00",
        "end_time": "12:00:00"
      },
      {
        "available_day": "Wednesday",
        "start_time": "14:00:00",
        "end_time": "17:00:00"
      },
      {
        "available_day": "Friday",
        "start_time": "10:00:00",
        "end_time": "15:00:00"
      }
    ]
  }'
```

**Expected Response (201):**
```json
[
  {
    "id": "availability-uuid-1",
    "available_day": "Monday",
    "start_time": "09:00:00",
    "end_time": "12:00:00"
  },
  {
    "id": "availability-uuid-2",
    "available_day": "Wednesday",
    "start_time": "14:00:00",
    "end_time": "17:00:00"
  },
  {
    "id": "availability-uuid-3",
    "available_day": "Friday",
    "start_time": "10:00:00",
    "end_time": "15:00:00"
  }
]
```

**Validation Error (400):**
```json
{
  "error": "slots must be an array"
}
```

---

## 4. APPOINTMENT ENDPOINTS

### 4.1 POST `/appointments` - Create Appointment

**Valid Request:**
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-uuid",
    "doctor_id": "doctor-uuid",
    "appointment_time": "2024-06-01T10:00:00Z",
    "notes": "Regular checkup"
  }'
```

**Expected Response (201):**
```json
{
  "id": "appointment-uuid",
  "patient_id": "patient-uuid",
  "doctor_id": "doctor-uuid",
  "appointment_time": "2024-06-01T10:00:00.000Z",
  "status": "pending",
  "notes": "Regular checkup",
  "cancellation_reason": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Validation Error (400):**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Patient ID is required",
      "path": "patient_id",
      "location": "body"
    }
  ]
}
```

### 4.2 GET `/appointments` - Get All Appointments

**Valid Request:**
```bash
curl -X GET http://localhost:3000/appointments
```

**Expected Response (200):**
```json
[
  {
    "id": "appointment-uuid-1",
    "patient_id": "patient-uuid-1",
    "doctor_id": "doctor-uuid-1",
    "appointment_time": "2024-06-01T10:00:00.000Z",
    "status": "pending",
    "notes": "Regular checkup",
    "cancellation_reason": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "appointment-uuid-2",
    "patient_id": "patient-uuid-2",
    "doctor_id": "doctor-uuid-2",
    "appointment_time": "2024-06-02T14:00:00.000Z",
    "status": "confirmed",
    "notes": "Follow-up",
    "cancellation_reason": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4.3 GET `/appointments/:id` - Get Appointment by ID

**Valid Request:**
```bash
curl -X GET http://localhost:3000/appointments/appointment-uuid
```

**Expected Response (200):**
```json
{
  "id": "appointment-uuid",
  "patient_id": "patient-uuid",
  "doctor_id": "doctor-uuid",
  "appointment_time": "2024-06-01T10:00:00.000Z",
  "status": "pending",
  "notes": "Regular checkup",
  "cancellation_reason": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Not Found (404):**
```json
{
  "error": "Appointment not found"
}
```

### 4.4 PUT `/appointments/:id` - Update Appointment

**Valid Request:**
```bash
curl -X PUT http://localhost:3000/appointments/appointment-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_time": "2024-06-01T11:00:00Z",
    "status": "confirmed",
    "notes": "Rescheduled appointment"
  }'
```

**Expected Response (200):**
```json
{
  "id": "appointment-uuid",
  "patient_id": "patient-uuid",
  "doctor_id": "doctor-uuid",
  "appointment_time": "2024-06-01T11:00:00.000Z",
  "status": "confirmed",
  "notes": "Rescheduled appointment",
  "cancellation_reason": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T01:00:00.000Z"
}
```

### 4.5 DELETE `/appointments/:id` - Cancel Appointment

**Valid Request:**
```bash
curl -X DELETE http://localhost:3000/appointments/appointment-uuid
```

**Expected Response (200):**
```json
{
  "message": "Appointment cancelled",
  "appointment": {
    "id": "appointment-uuid",
    "patient_id": "patient-uuid",
    "doctor_id": "doctor-uuid",
    "appointment_time": "2024-06-01T10:00:00.000Z",
    "status": "pending",
    "notes": "Regular checkup",
    "cancellation_reason": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 5. FILE UPLOAD ENDPOINTS

### 5.1 POST `/users/upload` - Upload File

**Valid Request (multipart/form-data):**
```bash
curl -X POST http://localhost:3000/users/upload \
  -F "file=@/path/to/document.pdf"
```

**Expected Response (201):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "fieldname": "file",
    "originalname": "document.pdf",
    "encoding": "7bit",
    "mimetype": "application/pdf",
    "destination": "uploads/",
    "filename": "generated-filename.pdf",
    "path": "uploads/generated-filename.pdf",
    "size": 12345
  }
}
```

**No File Error (400):**
```json
{
  "error": "No file uploaded"
}
```

### 5.2 GET `/users/uploads/:id` - Get File/Download Link

**Valid Request:**
```bash
curl -X GET http://localhost:3000/users/uploads/file-uuid
```

**Expected Response (200):**
```json
{
  "file_url": "https://appwrite.example.com/v1/storage/files/file-id/view?project=project-id",
  "file_name": "document.pdf"
}
```

**Not Found (404):**
```json
{
  "error": "File not found"
}
```

---

## 6. PAYMENT ENDPOINTS

### 6.1 POST `/payments/checkout` - Create Payment Session

**Valid Request:**
```bash
curl -X POST http://localhost:3000/payments/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "currency": "INR",
    "patient_id": "patient-uuid",
    "appointment_id": "appointment-uuid"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Payment session created (mock)"
}
```

### 6.2 POST `/payments/webhook` - Handle Payment Webhook

**Valid Request:**
```bash
curl -X POST http://localhost:3000/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "payment-uuid",
    "status": "success",
    "amount": 500
  }'
```

**Expected Response (200):**
```json
{
  "message": "Webhook received (mock)"
}
```

---

## 7. ERROR RESPONSES

### 7.1 Validation Errors (400)
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### 7.2 Not Found (404)
```json
{
  "error": "Resource not found"
}
```

### 7.3 Conflict (409)
```json
{
  "error": "Email already exists"
}
```

### 7.4 Server Error (500)
```json
{
  "error": "Something went wrong!"
}
```

---

## 8. TESTING CHECKLIST

### 8.1 Patient Endpoints
- [ ] Create patient with valid data
- [ ] Create patient with missing required fields (validation error)
- [ ] Create patient with invalid email format
- [ ] Create patient with duplicate email (conflict error)
- [ ] Get patient by valid ID
- [ ] Get patient by invalid ID (not found)
- [ ] Update patient with valid data
- [ ] Update patient with invalid data (validation error)

### 8.2 Doctor Endpoints
- [ ] Create doctor with valid data
- [ ] Create doctor with missing required fields (validation error)
- [ ] Get all doctors
- [ ] Get doctor by valid ID
- [ ] Get doctor by invalid ID (not found)
- [ ] Update doctor with valid data
- [ ] Update doctor with invalid data (validation error)

### 8.3 Doctor Availability Endpoints
- [ ] Get doctor availability (empty list if none set)
- [ ] Set doctor availability with valid slots
- [ ] Set doctor availability with invalid data (not array)
- [ ] Get doctor availability after setting

### 8.4 Appointment Endpoints
- [ ] Create appointment with valid data
- [ ] Create appointment with missing required fields (validation error)
- [ ] Create appointment with invalid date format
- [ ] Get all appointments
- [ ] Get appointment by valid ID
- [ ] Get appointment by invalid ID (not found)
- [ ] Update appointment with valid data
- [ ] Cancel appointment

### 8.5 File Upload Endpoints
- [ ] Upload file successfully
- [ ] Upload without file (error)
- [ ] Get file by valid ID
- [ ] Get file by invalid ID (not found)

### 8.6 Payment Endpoints
- [ ] Create payment session
- [ ] Handle payment webhook

### 8.7 Error Handling
- [ ] Test validation errors
- [ ] Test not found errors
- [ ] Test conflict errors
- [ ] Test server errors

---

## 9. POSTMAN COLLECTION

You can import these endpoints into Postman:

1. Create a new collection called "Patient Management System"
2. Set base URL variable: `{{baseUrl}}` = `http://localhost:3000`
3. Create folders for each endpoint group
4. Add the requests using the examples above
5. Set up environment variables for dynamic IDs

---

## 10. AUTOMATED TESTING

For automated testing, consider using:
- **Jest** with **supertest** for API testing
- **Postman Collections** with Newman for CI/CD
- **Rest Assured** (Java) or **requests** (Python) for integration tests

---

## 11. NOTES

- All UUIDs in examples are placeholders - use actual UUIDs from your database
- Dates are in ISO 8601 format
- File uploads require multipart/form-data
- Payment endpoints are currently mocked - integrate with real payment gateway
- Appwrite integration for file uploads needs to be implemented
- Consider adding authentication/authorization for production use 