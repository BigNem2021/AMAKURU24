'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
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
        localStorage.setItem('adminEmail', email);
        router.push('/admin/create-article');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-black flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-600 p-3 rounded-full">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Admin Access
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Enter the password to access the admin panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-amber-600 hover:bg-red-700 disabled:bg-amber-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Admin Portal © 2026
        </div>
      </div>
    </div>
  );
}

