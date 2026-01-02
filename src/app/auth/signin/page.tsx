'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Globe, AlertCircle } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from '@/lib/firebaseClient';

type UserRole = 'ADMIN' | 'EMPLOYER' | 'JOB_SEEKER';

type ApiUser = {
  id: string;
  email: string;
  role: UserRole;
  profile?: {
    onboardingCompleted?: boolean;
    [key: string]: unknown;
  } | null;
};

type AuthResponse = {
  success?: boolean;
  user: ApiUser;
  error?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const clone = response.clone();
  try {
    return (await response.json()) as T;
  } catch {
    const text = await clone.text();
    console.error('Response text (not JSON):', text.substring(0, 500));
    throw new Error(`Server error: ${response.status}. Check server console for details.`);
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();

      // Send ID token to backend
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await parseJson<AuthResponse>(response);

      if (!response.ok) {
        throw new Error(data.error || `Sign in failed: ${response.status}`);
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userRole', data.user.role);
        const displayName =
          (data.user.profile as { fullName?: string } | null)?.fullName || data.user.email;
        const subtitle =
          data.user.role === 'ADMIN'
            ? 'Admin'
            : data.user.role === 'EMPLOYER'
              ? 'Employer'
              : 'Job Seeker';
        window.localStorage.setItem('userName', displayName);
        window.localStorage.setItem('userSubtitle', subtitle);
      }

      // Redirect based on user role - signin should never show onboarding
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (data.user.role === 'EMPLOYER') {
        router.push('/dashboard/employer');
      } else {
        router.push('/dashboard/seeker');
      }
      setLoading(false);
    } catch (err) {
      let message = 'Failed to sign in';

      if (err instanceof Error) {
        // Handle Firebase auth errors
        if (
          err.message.includes('auth/invalid-credential') ||
          err.message.includes('auth/wrong-password') ||
          err.message.includes('auth/user-not-found') ||
          err.message.includes('auth/invalid-email')
        ) {
          message = 'Invalid email or password. Please check your credentials and try again.';
        } else if (err.message.includes('auth/too-many-requests')) {
          message = 'Too many failed attempts. Please try again later.';
        } else if (err.message.includes('auth/network-request-failed')) {
          message = 'Network error. Please check your connection and try again.';
        } else {
          message = err.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Try to sign in first
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.status === 404) {
        // If user doesn't exist, redirect to signup page
        router.push('/auth/signup');
        setLoading(false);
        return;
      }

      const data = await parseJson<AuthResponse>(response);

      if (!response.ok) {
        throw new Error(data.error || `Sign in failed: ${response.status}`);
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userRole', data.user.role);
        const displayName =
          (data.user.profile as { fullName?: string } | null)?.fullName || data.user.email;
        const subtitle =
          data.user.role === 'ADMIN'
            ? 'Admin'
            : data.user.role === 'EMPLOYER'
              ? 'Employer'
              : 'Job Seeker';
        window.localStorage.setItem('userName', displayName);
        window.localStorage.setItem('userSubtitle', subtitle);
      }

      // Redirect based on user role - signin should never show onboarding
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (data.user.role === 'EMPLOYER') {
        router.push('/dashboard/employer');
      } else {
        router.push('/dashboard/seeker');
      }
      setLoading(false);
    } catch (err) {
      console.error('Google sign in error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-12">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1400")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/85 to-blue-900/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-5">
        {/* Glass panel */}
        <div className="hidden lg:flex w-full lg:w-1/2">
          <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white p-6 shadow-[0_30px_60px_rgba(3,7,18,0.6)]">
            <div className="flex items-center gap-3 mb-6 text-xs text-white/70">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  360 Technologies
                </p>
                <p className="text-sm font-semibold text-white">Career OS for modern teams</p>
              </div>
            </div>

            <h1 className="text-2xl font-semibold mb-2">Make your next move with confidence.</h1>
            <p className="text-white/70 text-xs leading-relaxed mb-4 max-w-md">
              Discover curated opportunities, track your interviews, and collaborate with employers
              in one elevated workspace.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <InsightCard label="Active Applications" value="06" hint="+2 this week" />
              <InsightCard label="Invites received" value="14" hint="3 pending replies" />
              <InsightCard label="Profile views" value="234" hint="+12% vs last month" />
              <InsightCard label="Shortlists" value="04" hint="2 in final stage" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/20 flex items-center justify-center text-white text-[10px] font-semibold"
                  >
                    {['SW', 'AK', 'MR', 'DL'][i - 1]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold">12k+ professionals</p>
                <p className="text-[10px] text-white/60">already simplifying their job search</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white border border-white/40 rounded-xl shadow-[0_25px_55px_rgba(15,23,42,0.35)] p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base font-bold">
                360°
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">
                  Login Portal
                </p>
                <p className="text-base font-semibold text-gray-900">Welcome back</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              Sign in to access your personalized dashboard and stay in sync with your applications.
            </p>

            {error && (
              <div className="mb-4 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-sm text-red-700 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800 mb-1">Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Keep me signed in on this device
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
              >
                {loading ? 'Signing In...' : 'Sign in'}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                <span className="px-3 bg-white/90">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-2xl opacity-40 cursor-not-allowed"
              >
                <LinkedinIcon />
                <span className="text-sm font-medium text-gray-500">LinkedIn</span>
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-center text-xs text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] text-white/60 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-[11px] text-emerald-300">{hint}</p>
    </div>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0077B5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
