import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Plus,
  Trash2,
  Save,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { doctorsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Spinner, Badge } from '../components/ui';
import { formatTime } from '../lib/utils';
import toast from 'react-hot-toast';

interface AvailabilitySlot {
  id?: number;
  available_day: string;
  start_time: string;
  end_time: string;
}

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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

export function DoctorAvailability() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      // Mock doctor ID - in real app, get from user context
      const doctorId = user?.id || 1;
      const response = await doctorsApi.getAvailability(doctorId);
      setSlots(response.data || []);
    } catch (error) {
      // Initialize with empty slots if no availability set
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addSlot = (day: string) => {
    const newSlot: AvailabilitySlot = {
      available_day: day,
      start_time: '09:00',
      end_time: '17:00',
    };
    setSlots([...slots, newSlot]);
    setHasChanges(true);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
    setHasChanges(true);
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    try {
      const doctorId = user?.id || 1;
      await doctorsApi.setAvailability(doctorId, slots);
      toast.success('Availability saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save availability');
    } finally {
      setIsSaving(false);
    }
  };

  const getSlotsByDay = (day: string) => {
    return slots.filter((slot) => slot.available_day === day);
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
            <h1 className="text-3xl font-bold text-slate-800">My Availability</h1>
            <p className="text-slate-500 mt-1">
              Set your weekly schedule for patient appointments
            </p>
          </div>
          <Button
            leftIcon={<Save className="w-5 h-5" />}
            onClick={saveAvailability}
            isLoading={isSaving}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Managing Your Schedule</h3>
              <p className="text-sm text-blue-700 mt-1">
                Add time slots for each day you're available. Patients will be able to book
                appointments during these hours.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div variants={containerVariants} className="space-y-4">
        {days.map((day, dayIndex) => {
          const daySlots = getSlotsByDay(day);
          const isActive = daySlots.length > 0;

          return (
            <motion.div
              key={day}
              variants={itemVariants}
              custom={dayIndex}
            >
              <Card className={`transition-all ${isActive ? 'border-primary-200 bg-primary-50/30' : ''}`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-primary-100' : 'bg-slate-100'
                      }`}>
                        <Clock className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{day}</h3>
                        <p className="text-sm text-slate-500">
                          {isActive
                            ? `${daySlots.length} time slot${daySlots.length > 1 ? 's' : ''}`
                            : 'Not available'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addSlot(day)}
                      className="flex items-center gap-2 px-4 py-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slot
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {daySlots.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {slots.map((slot, index) => {
                          if (slot.available_day !== day) return null;

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                            >
                              <div className="flex-1 flex items-center gap-4">
                                <div>
                                  <label className="text-xs text-slate-500 mb-1 block">Start Time</label>
                                  <input
                                    type="time"
                                    value={slot.start_time}
                                    onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                                    className="input-field py-2"
                                  />
                                </div>
                                <div className="text-slate-400">to</div>
                                <div>
                                  <label className="text-xs text-slate-500 mb-1 block">End Time</label>
                                  <input
                                    type="time"
                                    value={slot.end_time}
                                    onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                                    className="input-field py-2"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge>
                                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </Badge>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeSlot(index)}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Schedule Summary</h3>
              <p className="text-sm text-green-700 mt-1">
                You have {slots.length} time slot{slots.length !== 1 ? 's' : ''} set across{' '}
                {new Set(slots.map((s) => s.available_day)).size} day
                {new Set(slots.map((s) => s.available_day)).size !== 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
