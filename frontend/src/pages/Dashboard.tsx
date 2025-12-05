import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Activity,
  UserCheck,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card hover className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 ${color}`} />
        <CardContent className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
              {change && (
                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  {change}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PatientDashboard() {
  const stats = [
    {
      title: 'Upcoming Appointments',
      value: 3,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed Visits',
      value: 12,
      change: '+2 this month',
      icon: <CalendarCheck className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
    },
    {
      title: 'My Doctors',
      value: 4,
      icon: <UserCheck className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Reports',
      value: 2,
      icon: <AlertCircle className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
    },
  ];

  const upcomingAppointments = [
    { doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'Dec 10, 2024', time: '10:00 AM' },
    { doctor: 'Dr. Michael Chen', specialty: 'Dermatologist', date: 'Dec 12, 2024', time: '2:30 PM' },
    { doctor: 'Dr. Emily Brown', specialty: 'General Physician', date: 'Dec 15, 2024', time: '11:00 AM' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((apt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-primary-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{apt.doctor}</p>
                      <p className="text-sm text-slate-500">{apt.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{apt.date}</p>
                      <p className="text-sm text-slate-500">{apt.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Blood Pressure</span>
                    <span className="text-sm text-green-600">Normal</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">120/80 mmHg</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Heart Rate</span>
                    <span className="text-sm text-blue-600">Good</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">72 bpm</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-800">Blood Sugar</span>
                    <span className="text-sm text-purple-600">Normal</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">95 mg/dL</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

function DoctorDashboard() {
  const stats = [
    {
      title: "Today's Appointments",
      value: 8,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Patients',
      value: 156,
      change: '+12 this month',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Requests',
      value: 5,
      icon: <Clock className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Completed Today',
      value: 4,
      icon: <CalendarCheck className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
    },
  ];

  const todaySchedule = [
    { patient: 'John Smith', time: '9:00 AM', type: 'Check-up', status: 'completed' },
    { patient: 'Emma Wilson', time: '10:00 AM', type: 'Follow-up', status: 'completed' },
    { patient: 'Michael Brown', time: '11:00 AM', type: 'Consultation', status: 'in-progress' },
    { patient: 'Sarah Davis', time: '2:00 PM', type: 'Check-up', status: 'upcoming' },
    { patient: 'James Johnson', time: '3:00 PM', type: 'Follow-up', status: 'upcoming' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((apt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    apt.status === 'in-progress'
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : apt.status === 'completed'
                      ? 'bg-slate-50'
                      : 'bg-white border border-slate-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    apt.status === 'completed'
                      ? 'bg-green-500'
                      : apt.status === 'in-progress'
                      ? 'bg-primary-500 animate-pulse'
                      : 'bg-slate-300'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      apt.status === 'completed' ? 'text-slate-400' : 'text-slate-800'
                    }`}>
                      {apt.patient}
                    </p>
                    <p className="text-sm text-slate-500">{apt.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      apt.status === 'completed' ? 'text-slate-400' : 'text-slate-800'
                    }`}>
                      {apt.time}
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      apt.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : apt.status === 'in-progress'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {apt.status === 'in-progress' ? 'In Progress' : apt.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}

function AdminDashboard() {
  const stats = [
    {
      title: 'Total Patients',
      value: '2,456',
      change: '+15% this month',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Doctors',
      value: 48,
      change: '+3 new',
      icon: <UserCheck className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
    },
    {
      title: "Today's Appointments",
      value: 127,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Revenue This Month',
      value: '$45.2K',
      change: '+8%',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New patient registered', time: '5 minutes ago', type: 'patient' },
                  { action: 'Dr. Smith updated availability', time: '15 minutes ago', type: 'doctor' },
                  { action: 'Appointment cancelled', time: '1 hour ago', type: 'appointment' },
                  { action: 'Payment received', time: '2 hours ago', type: 'payment' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'patient' ? 'bg-blue-500' :
                      activity.type === 'doctor' ? 'bg-green-500' :
                      activity.type === 'appointment' ? 'bg-orange-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'API Server', status: 'Operational', uptime: '99.9%' },
                  { name: 'Database', status: 'Operational', uptime: '99.8%' },
                  { name: 'Payment Gateway', status: 'Operational', uptime: '99.7%' },
                  { name: 'Email Service', status: 'Operational', uptime: '99.9%' },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-medium text-slate-800">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-green-600">{service.status}</span>
                      <p className="text-xs text-slate-500">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export function Dashboard() {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="page-container"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back, {user?.full_name?.split(' ')[0]}!
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with your {user?.role === 'doctor' ? 'practice' : user?.role === 'admin' ? 'platform' : 'health'} today.
        </p>
      </motion.div>

      {getDashboardContent()}
    </motion.div>
  );
}
