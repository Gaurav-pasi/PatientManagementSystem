import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Stethoscope,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Card } from '../components/ui';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['patient', 'doctor']),
  phone_number: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dob: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const features = [
  'Book appointments with top doctors',
  'Access your medical records anytime',
  'Get appointment reminders',
  'Secure and private health data',
];

export function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 via-accent-600 to-accent-800 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-40 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <Stethoscope className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">MediCare</span>
          </Link>
        </div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Start Your Health
            <br />
            Journey Today
          </motion.h1>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <p className="text-white/60 text-sm">
            Already trusted by healthcare professionals and patients worldwide.
          </p>
        </motion.div>
      </motion.div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="lg:hidden w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-500/30"
            >
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create account</h2>
            <p className="text-slate-500">Join MediCare and take control of your health</p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            {['patient', 'doctor'].map((role) => (
              <motion.label
                key={role}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === role
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  value={role}
                  {...register('role')}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    selectedRole === role
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {role === 'patient' ? (
                      <User className="w-6 h-6" />
                    ) : (
                      <Stethoscope className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`font-semibold capitalize ${
                    selectedRole === role ? 'text-primary-600' : 'text-slate-700'
                  }`}>
                    {role}
                  </p>
                </div>
              </motion.label>
            ))}
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={<User className="w-5 h-5" />}
                error={errors.full_name?.message}
                {...register('full_name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.password?.message}
                  {...register('password')}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5" />}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="w-5 h-5" />}
                {...register('phone_number')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select gender"
                  {...register('gender')}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dob')}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          </Card>

          <p className="text-center mt-6 text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
