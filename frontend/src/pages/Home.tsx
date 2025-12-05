import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Calendar,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Heart,
  Activity,
} from 'lucide-react';
import { Button } from '../components/ui';

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments with your preferred doctors in just a few clicks.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is protected with enterprise-grade security.',
    color: 'from-green-400 to-green-600',
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Access your medical records and manage appointments anytime.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: Users,
    title: 'Expert Doctors',
    description: 'Connect with experienced healthcare professionals.',
    color: 'from-orange-400 to-orange-600',
  },
];

const stats = [
  { value: '10K+', label: 'Patients' },
  { value: '500+', label: 'Doctors' },
  { value: '50K+', label: 'Appointments' },
  { value: '99%', label: 'Satisfaction' },
];


export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [5, 0, 5],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-accent-100/50 to-primary-100/50 rounded-full blur-3xl"
          />
        </div>

        <div className="page-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6"
              >
                <Heart className="w-4 h-4" />
                Your Health, Our Priority
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Modern Healthcare
                <br />
                <span className="gradient-text">Made Simple</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Experience seamless healthcare management. Book appointments,
                access medical records, and connect with top doctors — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="secondary" size="lg">
                    Find Doctors
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex items-center gap-6"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-sm font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">Trusted by 10,000+ patients</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-white rounded-3xl shadow-2xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Your Dashboard</h3>
                      <p className="text-slate-500">Manage your health</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {['Upcoming Appointment', 'Medical Records', 'Lab Results'].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-slate-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700">Health Score: 92</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Next: Dr. Smith, 2 PM</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-slate-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive healthcare management tools designed for patients and doctors alike.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-white/50"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                Join MediCare today and take the first step towards better health management.
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-white/90 shadow-xl"
                >
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MediCare</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 MediCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
