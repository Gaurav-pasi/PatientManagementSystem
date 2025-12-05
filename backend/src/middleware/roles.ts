import { Request, Response, NextFunction } from 'express';

/**
 * Role-based Access Control Middleware
 * 
 * This middleware checks if the authenticated user has the required role(s)
 * to access a specific endpoint. It should be used after the authenticateToken middleware.
 */

// Define user roles
export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Check if user has any of the required roles
 * @param requiredRoles - Array of roles that can access the endpoint
 */
export const requireRole = (requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
      return;
    }

    if (!requiredRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${req.user.role}`
      });
      return;
    }

    next();
  };
};

/**
 * Check if user has admin role
 */
export const requireAdmin = requireRole([ROLES.ADMIN]);

/**
 * Check if user has doctor role
 */
export const requireDoctor = requireRole([ROLES.DOCTOR]);

/**
 * Check if user has patient role
 */
export const requirePatient = requireRole([ROLES.PATIENT]);

/**
 * Check if user is doctor or admin
 */
export const requireDoctorOrAdmin = requireRole([ROLES.DOCTOR, ROLES.ADMIN]);

/**
 * Check if user is patient or admin
 */
export const requirePatientOrAdmin = requireRole([ROLES.PATIENT, ROLES.ADMIN]);

/**
 * Check if user is accessing their own resource or is admin
 * @param resourceUserIdField - Field name containing the user ID in the request
 */
export const requireOwnershipOrAdmin = (resourceUserIdField: string = 'user_id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
      return;
    }

    // Admin can access any resource
    if (req.user.role === ROLES.ADMIN) {
      next();
      return;
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (!resourceUserId) {
      res.status(400).json({
        error: 'Missing user ID',
        message: 'User ID is required to verify ownership'
      });
      return;
    }

    if (parseInt(resourceUserId) !== req.user.id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own resources'
      });
      return;
    }

    next();
  };
};

/**
 * Check if user is accessing their own appointment or is admin/doctor
 */
export const requireAppointmentAccess = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
      return;
    }

    // Admin and doctors can access any appointment
    if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.DOCTOR) {
      next();
      return;
    }

    // Patients can only access their own appointments
    const appointmentId = req.params.id || req.params.appointment_id;
    
    if (!appointmentId) {
      res.status(400).json({
        error: 'Missing appointment ID',
        message: 'Appointment ID is required'
      });
      return;
    }

    // For patients, we'll need to check if the appointment belongs to them
    // This will be handled in the controller by checking patient_id
    next();
  };
}; 