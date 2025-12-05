import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { patientsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Modal, Avatar, Badge, Spinner, Input } from '../components/ui';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

interface Patient {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  gender?: string;
  dob?: string;
  medical_history?: string;
  allergies?: string;
  emergency_contact?: string;
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

// Mock data for demonstration
const mockPatients: Patient[] = [
  {
    id: 1,
    user_id: 1,
    full_name: 'John Smith',
    email: 'john.smith@email.com',
    phone_number: '+1 555-0101',
    gender: 'male',
    dob: '1985-03-15',
    medical_history: 'Hypertension, Type 2 Diabetes',
    allergies: 'Penicillin',
    emergency_contact: 'Jane Smith - +1 555-0102',
  },
  {
    id: 2,
    user_id: 2,
    full_name: 'Emily Johnson',
    email: 'emily.j@email.com',
    phone_number: '+1 555-0103',
    gender: 'female',
    dob: '1990-07-22',
    medical_history: 'Asthma',
    allergies: 'None',
    emergency_contact: 'Mike Johnson - +1 555-0104',
  },
  {
    id: 3,
    user_id: 3,
    full_name: 'Michael Brown',
    email: 'm.brown@email.com',
    phone_number: '+1 555-0105',
    gender: 'male',
    dob: '1978-11-30',
    medical_history: 'Previous knee surgery (2019)',
    allergies: 'Sulfa drugs',
    emergency_contact: 'Sarah Brown - +1 555-0106',
  },
];

export function Patients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredPatients = patients.filter((patient) =>
    patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
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
              {user?.role === 'doctor' ? 'My Patients' : 'All Patients'}
            </h1>
            <p className="text-slate-500 mt-1">
              View and manage patient records
            </p>
          </div>
          {user?.role === 'admin' && (
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Add Patient
            </Button>
          )}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No patients found</h3>
          <p className="text-slate-500">Try adjusting your search criteria</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar name={patient.full_name} size="lg" />
                      <div>
                        <h3 className="font-bold text-slate-800">{patient.full_name}</h3>
                        <p className="text-sm text-slate-500 capitalize">{patient.gender}</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {patient.email}
                    </div>
                    {patient.phone_number && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {patient.phone_number}
                      </div>
                    )}
                    {patient.dob && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(patient.dob)}
                      </div>
                    )}
                  </div>

                  {patient.allergies && patient.allergies !== 'None' && (
                    <div className="p-3 bg-red-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Allergies: {patient.allergies}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      leftIcon={<Eye className="w-4 h-4" />}
                      onClick={() => handleViewPatient(patient)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit className="w-4 h-4" />}
                      onClick={() => handleEditPatient(patient)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl text-white">
              <Avatar name={selectedPatient.full_name} size="xl" />
              <div>
                <h3 className="text-xl font-bold">{selectedPatient.full_name}</h3>
                <p className="opacity-80">{selectedPatient.email}</p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Phone</p>
                <p className="font-semibold text-slate-800">{selectedPatient.phone_number || 'N/A'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-800">
                  {selectedPatient.dob ? formatDate(selectedPatient.dob) : 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Gender</p>
                <p className="font-semibold text-slate-800 capitalize">{selectedPatient.gender || 'N/A'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-1">Emergency Contact</p>
                <p className="font-semibold text-slate-800">{selectedPatient.emergency_contact || 'N/A'}</p>
              </div>
            </div>

            {/* Medical Info */}
            {selectedPatient.allergies && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Allergies</h4>
                </div>
                <p className="text-red-700">{selectedPatient.allergies}</p>
              </div>
            )}

            {selectedPatient.medical_history && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Medical History</h4>
                </div>
                <p className="text-blue-700">{selectedPatient.medical_history}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
              <Button className="flex-1" onClick={() => {
                setIsDetailModalOpen(false);
                setIsEditModalOpen(true);
              }}>
                Edit Patient
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient"
        size="lg"
      >
        {selectedPatient && (
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                defaultValue={selectedPatient.full_name}
              />
              <Input
                label="Email"
                type="email"
                defaultValue={selectedPatient.email}
              />
              <Input
                label="Phone Number"
                defaultValue={selectedPatient.phone_number}
              />
              <Input
                label="Date of Birth"
                type="date"
                defaultValue={selectedPatient.dob}
              />
            </div>

            <div>
              <label className="form-label">Allergies</label>
              <textarea
                className="input-field min-h-[80px] resize-none"
                defaultValue={selectedPatient.allergies}
              />
            </div>

            <div>
              <label className="form-label">Medical History</label>
              <textarea
                className="input-field min-h-[100px] resize-none"
                defaultValue={selectedPatient.medical_history}
              />
            </div>

            <div>
              <label className="form-label">Emergency Contact</label>
              <Input defaultValue={selectedPatient.emergency_contact} />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => {
                toast.success('Patient updated successfully!');
                setIsEditModalOpen(false);
              }}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </motion.div>
  );
}
