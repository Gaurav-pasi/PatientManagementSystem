import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Check,
  X,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { appointmentsApi, doctorsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Modal, Badge, Avatar, Spinner, Select } from '../components/ui';
import { formatDateTime, formatDate, cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  cancellation_reason?: string;
  patient_name?: string;
  doctor_name?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsApi.getAll();
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await appointmentsApi.cancel(selectedAppointment.id, cancelReason);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
      setIsCancelModalOpen(false);
      setCancelReason('');
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleCompleteAppointment = async (id: number) => {
    try {
      await appointmentsApi.update(id, { status: 'completed' });
      toast.success('Appointment marked as completed');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch =
      apt.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && (searchQuery ? matchesSearch : true);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="status" status="scheduled">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="status" status="completed">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="status" status="cancelled">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="page-container"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Appointments</h1>
            <p className="text-slate-500 mt-1">
              {user?.role === 'patient'
                ? 'View and manage your appointments'
                : 'Manage all appointments'}
            </p>
          </div>
          <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsCreateModalOpen(true)}>
            New Appointment
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: appointments.length, color: 'bg-slate-100 text-slate-700' },
          { label: 'Scheduled', value: appointments.filter((a) => a.status === 'scheduled').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Completed', value: appointments.filter((a) => a.status === 'completed').length, color: 'bg-green-100 text-green-700' },
          { label: 'Cancelled', value: appointments.filter((a) => a.status === 'cancelled').length, color: 'bg-red-100 text-red-700' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl ${stat.color}`}
          >
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    filter === status
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No appointments found</h3>
          <p className="text-slate-500 mb-6">
            {filter === 'all'
              ? "You don't have any appointments yet"
              : `No ${filter} appointments`}
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Book Your First Appointment
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              variants={itemVariants}
              custom={index}
              layout
            >
              <Card className={cn(
                'transition-all',
                appointment.status === 'cancelled' && 'opacity-60'
              )}>
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                  {/* Avatar and Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar
                      name={user?.role === 'patient' ? (appointment.doctor_name || 'Doctor') : (appointment.patient_name || 'Patient')}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {user?.role === 'patient'
                          ? `Dr. ${appointment.doctor_name || 'Unknown'}`
                          : appointment.patient_name || 'Unknown Patient'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.appointment_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(appointment.appointment_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    {getStatusBadge(appointment.status)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>

                    {appointment.status === 'scheduled' && (
                      <>
                        {user?.role !== 'patient' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCompleteAppointment(appointment.id)}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsCancelModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="px-4 pb-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </div>
                  </div>
                )}

                {/* Cancellation Reason */}
                {appointment.cancellation_reason && (
                  <div className="px-4 pb-4">
                    <div className="p-3 bg-red-50 rounded-lg text-sm text-red-600">
                      <span className="font-medium">Cancellation Reason:</span> {appointment.cancellation_reason}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Appointment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>
          <div>
            <label className="form-label">Reason for cancellation</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Please provide a reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsCancelModalOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleCancelAppointment}>
              Cancel Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Appointment Details"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Avatar name={selectedAppointment.doctor_name || 'Doctor'} size="lg" />
              <div>
                <h3 className="font-bold text-slate-800">
                  {user?.role === 'patient'
                    ? `Dr. ${selectedAppointment.doctor_name || 'Unknown'}`
                    : selectedAppointment.patient_name || 'Unknown Patient'}
                </h3>
                {getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Date</p>
                <p className="font-semibold text-slate-800">
                  {formatDate(selectedAppointment.appointment_time)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Time</p>
                <p className="font-semibold text-slate-800">
                  {new Date(selectedAppointment.appointment_time).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Notes</p>
                <p className="text-slate-800">{selectedAppointment.notes}</p>
              </div>
            )}

            <Button variant="secondary" className="w-full" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Book New Appointment"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="form-label">Select Doctor</label>
            <select className="input-field">
              <option value="">Choose a doctor...</option>
              <option value="1">Dr. Sarah Johnson - Cardiologist</option>
              <option value="2">Dr. Michael Chen - Dermatologist</option>
              <option value="3">Dr. Emily Brown - General Physician</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date</label>
              <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="form-label">Time</label>
              <select className="input-field">
                <option value="">Select time...</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Any additional information for the doctor..."
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => {
              toast.success('Appointment booked successfully!');
              setIsCreateModalOpen(false);
            }}>
              Book Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
