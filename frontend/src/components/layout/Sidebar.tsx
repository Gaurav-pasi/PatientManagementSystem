import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Clock,
  CreditCard,
  FileText,
  Settings,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const menuItems = {
  patient: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Calendar, label: 'My Appointments', to: '/appointments' },
    { icon: Users, label: 'Find Doctors', to: '/doctors' },
    { icon: FileText, label: 'Medical Records', to: '/records' },
    { icon: CreditCard, label: 'Payments', to: '/payments' },
  ],
  doctor: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Calendar, label: 'Appointments', to: '/appointments' },
    { icon: Users, label: 'My Patients', to: '/patients' },
    { icon: Clock, label: 'Availability', to: '/availability' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Calendar, label: 'All Appointments', to: '/appointments' },
    { icon: Users, label: 'Patients', to: '/patients' },
    { icon: UserCog, label: 'Doctors', to: '/doctors' },
    { icon: CreditCard, label: 'Payments', to: '/payments' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ],
};

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const items = menuItems[user?.role as keyof typeof menuItems] || menuItems.patient;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-white/20 p-4 hidden lg:block"
    >
      <nav className="space-y-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <motion.div
              key={item.to}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.to}
                className={cn(
                  'sidebar-link',
                  isActive && 'sidebar-link-active'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-slate-500'
                )} />
                <span className={isActive ? 'text-white' : ''}>{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* User Role Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-4 right-4"
      >
        <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Logged in as</p>
              <p className="font-semibold capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}
