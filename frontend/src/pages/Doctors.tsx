import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Stethoscope,
  X,
  Plus,
} from 'lucide-react';
import { doctorsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input, Modal, Avatar, Badge, Spinner } from '../components/ui';
import toast from 'react-hot-toast';

interface Doctor {
  id: number;
  full_name: string;
  email: string;
  specialization: string;
  license_number: string;
  experience_years: number;
  phone_number?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Doctors() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const specialties = [
    'All Specialties',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'General Physician',
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorsApi.getAll();
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      !selectedSpecialty ||
      selectedSpecialty === 'All Specialties' ||
      doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
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
            <h1 className="text-3xl font-bold text-slate-800">
              {user?.role === 'admin' ? 'Manage Doctors' : 'Find a Doctor'}
            </h1>
            <p className="text-slate-500 mt-1">
              {user?.role === 'admin'
                ? 'View and manage all registered doctors'
                : 'Book appointments with our experienced specialists'}
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Add Doctor
            </Button>
          )}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {specialties.map((specialty) => (
                <motion.button
                  key={specialty}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                    selectedSpecialty === specialty ||
                    (!selectedSpecialty && specialty === 'All Specialties')
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {specialty}
                </motion.button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No doctors found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden group">
                {/* Header with gradient */}
                <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700 relative">
                  <div className="absolute -bottom-8 left-6">
                    <Avatar name={doctor.full_name} size="xl" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 pb-6 px-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{doctor.full_name}</h3>
                      <p className="text-primary-600 font-medium">{doctor.specialization || 'General'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-slate-700">4.8</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{doctor.experience_years || 0} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">New York, NY</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Appointment"
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Avatar name={selectedDoctor.full_name} size="lg" />
              <div>
                <h3 className="font-bold text-slate-800">{selectedDoctor.full_name}</h3>
                <p className="text-primary-600">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div>
              <label className="form-label">Select Date</label>
              <input type="date" className="input-field" min={new Date().toISOString().split('T')[0]} />
            </div>

            <div>
              <label className="form-label">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 border border-slate-200 rounded-lg text-sm font-medium hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Reason for Visit</label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                placeholder="Briefly describe your symptoms or reason for visit..."
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => {
                toast.success('Appointment booked successfully!');
                setIsModalOpen(false);
              }}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
