'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'editor'>('editor');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminEmail', data.user?.email || email);
        localStorage.setItem('adminRole', data.user?.role || 'editor');
        localStorage.setItem('adminName', data.user?.name || 'Admin');
        router.push('/admin/articles');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const currentAdminEmail = localStorage.getItem('adminEmail') || '';

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentAdminEmail,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to create user.');
        return;
      }

      setSuccess(`User created successfully as ${role}. You can now log in.`);
      setMode('login');
      setPassword('');
      setName('');
      setRole('editor');
    } catch {
      setError('An error occurred while creating user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 p-3 rounded-full">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Admin Access
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          {mode === 'login' ? 'Enter your credentials to access the admin panel' : 'Create a new admin or editor account'}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccess('');
            }}
            className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-red-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('create');
              setError('');
              setSuccess('');
            }}
            className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === 'create'
                ? 'bg-red-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Create User
          </button>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleCreateUser} className="space-y-4">
          {mode === 'create' && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Enter your password' : 'Create password (min 8 chars)'}
                className="w-full px-4 py-2 pr-11 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={isLoading}
                required
                minLength={mode === 'create' ? 8 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mode === 'create' && (
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'editor')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={isLoading}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password || (mode === 'create' && !name)}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading
              ? mode === 'login'
                ? 'Verifying...'
                : 'Creating...'
              : mode === 'login'
              ? 'Access Admin Panel'
              : 'Create Account'}
          </button>

          {mode === 'create' && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <UserPlus className="w-4 h-4" />
              <span>Only logged-in admins can create users after first setup.</span>
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Admin Portal © 2026
        </div>
      </div>
    </div>
  );
}

