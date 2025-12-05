import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />

      {isAuthenticated && <Sidebar />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`pt-16 ${isAuthenticated ? 'lg:pl-64' : ''}`}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
