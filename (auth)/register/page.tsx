/**
 * Registration Page
 * User registration with role selection for Agent Wrapping Platform
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Client components should use server actions for auth
// See: https://supabase.com/docs/guides/auth/server-side/nextjs
import Link from 'next/link';
import type { UserRole } from '@/lib/auth/permissions';
import { createClientComponentClient } from '@/lib/supabase-client';

const ROLE_DESCRIPTIONS: Record<UserRole, { title: string; description: string }> = {
  admin: {
    title: 'Administrator',
    description: 'Full system access. Manage users, settings, and platform operations.',
  },
  developer: {
    title: 'Developer',
    description: 'Create and publish agent engines. Build AI-powered tools.',
  },
  user: {
    title: 'User',
    description: 'Assemble agents from engines. Deploy and manage applications.',
  },
  customer: {
    title: 'Customer',
    description: 'Use deployed agent applications for your business.',
  },
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user' as UserRole,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClientComponentClient();

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError('Failed to create account');
        return;
      }

      // 2. Create user profile (will be created by trigger, but we ensure it)
      const { error: profileError } = await supabase.from('ef_user_profiles').insert({
        id: authData.user.id,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        tenant_id: '00000000-0000-0000-0000-000000000001', // System tenant initially
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway as profile might be created by trigger
      }

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/20">
              <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Account created!</h2>
            <p className="text-slate-400 mb-6">
              Welcome to Empleaido Factory. Redirecting you to the dashboard...
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-teal-400">Empleaido Factory</h1>
            <p className="text-slate-400 mt-2">Agent Wrapping Platform</p>
          </Link>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white">Create your account</h2>
            <p className="text-slate-400 mt-2">Choose your role and get started</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-4">
              I want to...
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(ROLE_DESCRIPTIONS) as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    formData.role === role
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-slate-600 hover:border-slate-500 bg-slate-900/30'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {ROLE_DESCRIPTIONS[role].title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {ROLE_DESCRIPTIONS[role].description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Password requirements */}
            <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">Password requirements:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contains letters and numbers
                </li>
              </ul>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-slate-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-slate-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-teal-400 hover:text-teal-300 transition">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-teal-400 hover:text-teal-300 transition">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-xs mt-6">
          <p>© 2026 Empleaido Factory. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
