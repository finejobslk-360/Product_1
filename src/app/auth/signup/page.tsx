'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Users, Briefcase, FileText, AlertCircle } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from '@/lib/firebaseClient';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

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

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>
      {children}
      {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
    </label>
  );
}

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

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    country: '',
    companyName: '',
    companyAddress: '',
    companyContact: '',
    registrationNumber: '',
    category: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<ApiUser | null>(null);
  const [adminExists, setAdminExists] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);

  // Check if admin already exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/auth/check-admin');
        const data = await response.json();
        setAdminExists(data.adminExists || false);
      } catch (err) {
        console.error('Error checking admin:', err);
        setAdminExists(false);
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // Only companies use two steps; others jump to final step
  useEffect(() => {
    setStep(formData.role === 'EMPLOYER' ? 1 : 2);
  }, [formData.role]);
  const validateStepOne = () => {
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    if (formData.role === 'JOB_SEEKER') {
      if (!formData.fullName || !formData.contactNumber || !formData.country) {
        setError('Full name, contact number, and country are required for job seekers');
        return false;
      }
    }
    if (formData.role === 'EMPLOYER') {
      if (!formData.companyName || !formData.companyContact) {
        setError('Company name and contact number are required for companies');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!validateStepOne()) return;
      setStep(2);
      return;
    }

    // Validation step 2
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain uppercase, lowercase, and number');
      return;
    }

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    // Re-run role-specific checks to be safe
    if (!validateStepOne()) return;

    setLoading(true);

    try {
      // Check if email already exists in DB to avoid asking further questions
      try {
        const checkRes = await fetch(`/api/auth/check-email?email=${encodeURIComponent(
          formData.email
        )}`);
        const checkData = await checkRes.json();
        if (checkRes.ok && checkData.exists) {
          setError('This email is already registered. Please sign in instead.');
          setLoading(false);
          return;
        }
      } catch (e) {
        // If the check fails, continue - we'll rely on Firebase/server errors
        console.warn('Email check failed:', e);
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const idToken = await userCredential.user.getIdToken();

      // Send to backend to create user in database
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role || 'JOB_SEEKER',
          contactNumber: formData.contactNumber || formData.companyContact,
          country: formData.country,
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          registrationNumber: formData.registrationNumber,
          category: formData.category,
        }),
      });

      const data = await parseJson<AuthResponse>(response);

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
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

      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
        return;
      }

      // Check if non-admin user needs onboarding
      if (!data.user.profile?.onboardingCompleted) {
        // Show onboarding only for new accounts that haven't completed it
        setUserData(data.user);
        setShowOnboarding(true);
      } else {
        // If onboarding already completed, go directly to dashboard
        if (data.user.role === 'EMPLOYER') {
          router.push('/dashboard/employer');
        } else {
          router.push('/user'); 
        }
      }
    } catch (err) {
      let message = 'Failed to create account';

      if (err instanceof Error) {
        // Handle Firebase auth errors
        if (err.message.includes('auth/email-already-in-use')) {
          message = 'This email is already registered. Please sign in instead.';
        } else if (err.message.includes('auth/invalid-email')) {
          message = 'Invalid email address. Please enter a valid email.';
        } else if (err.message.includes('auth/weak-password')) {
          message = 'Password is too weak. Please use a stronger password.';
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
      const displayName = result.user.displayName || '';
      const email = result.user.email || '';

      // Attempt to create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          fullName: displayName,
          email,
          role: formData.role || 'JOB_SEEKER',
          contactNumber: formData.contactNumber || formData.companyContact,
          country: formData.country,
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          registrationNumber: formData.registrationNumber,
          category: formData.category,
        }),
      });

      const data = await parseJson<AuthResponse>(response);

      // If user already exists, try sign in instead
      if (!response.ok && data.error?.includes('already exists')) {
        const signInResponse = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });

        const signInData = await parseJson<AuthResponse>(signInResponse);
        if (!signInResponse.ok) {
          throw new Error(signInData.error || 'Sign in failed');
        }

        if (signInData.user.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (signInData.user.role === 'EMPLOYER') {
          router.push('/dashboard');
        } else if (signInData.user.role === 'JOB_SEEKER') {
          router.push('/user');
        } else {
          router.push('/user');
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
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

      // Navigate based on role and onboarding status
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (!data.user.profile?.onboardingCompleted) {
        // Show onboarding only for new accounts that haven't completed it
        setUserData(data.user);
        setShowOnboarding(true);
      } else {
        // If onboarding already completed, go directly to dashboard
        if (data.user.role === 'EMPLOYER') {
          router.push('/dashboard');
        } else if (data.user.role === 'JOB_SEEKER') {
          router.push('/user');
        } else {
          router.push('/user');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (onboardingData: Record<string, unknown>) => {
    try {
      // Get current user's ID token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const idToken = await currentUser.getIdToken();

      // Save onboarding data (but don't fail if it doesn't work - user is already authenticated)
      try {
        const response = await fetch('/api/auth/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            onboardingData,
            idToken,
          }),
        });

        const data = await parseJson<{ error?: string; success?: boolean }>(response);

        if (!response.ok) {
          console.warn('Onboarding data save failed:', data.error || 'Unknown error');
          // Continue anyway - user is authenticated in Firebase
        }
      } catch (onboardingError) {
        console.warn('Error saving onboarding data:', onboardingError);
        // Continue anyway - user is authenticated in Firebase
      }

      setShowOnboarding(false);

      // Redirect based on user role (always navigate even if DB save failed)
      if (userData?.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (userData?.role === 'JOB_SEEKER') {
        router.push('/user');
      } else if (userData?.role === 'EMPLOYER') {
        router.push('/dashboard');
      } else {
        router.push('/user');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      const message = err instanceof Error ? err.message : 'Failed to complete onboarding';
      setError(message);
      // Still try to navigate if user is authenticated
      if (auth.currentUser) {
        setShowOnboarding(false);
        if (userData?.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (userData?.role === 'JOB_SEEKER') {
          router.push('/user');
        } else if (userData?.role === 'EMPLOYER') {
          router.push('/dashboard');
        } else {
          router.push('/user');
        }
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-12">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1400")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900/85 to-fuchsia-900/70" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-5">
        {/* Inspiration panel */}
        <div className="hidden lg:flex w-full lg:w-1/2">
          <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl text-white p-6 shadow-[0_30px_60px_rgba(3,7,18,0.6)]">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60 mb-2">
              Build your next chapter
            </p>
            <h1 className="text-2xl font-semibold mb-2">
              A single profile unlocks every opportunity.
            </h1>
            <p className="text-white/70 text-xs leading-relaxed mb-4 max-w-md">
              Collaborate with top employers, showcase your portfolio, and automate the boring parts
              of job searching.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  icon: Users,
                  label: 'Create once, apply anywhere',
                  text: 'Share tailored applications automatically.',
                },
                {
                  icon: Briefcase,
                  label: 'Track every conversation',
                  text: 'Stay on top of interviews and follow-ups.',
                },
                {
                  icon: FileText,
                  label: 'Stand out with interactive resumes',
                  text: 'Embed projects, videos, and case studies.',
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className="text-[11px] text-white/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white border border-white/40 rounded-xl shadow-[0_25px_55px_rgba(15,23,42,0.35)] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-semibold">
                  Join 
                </p>
                <h2 className="text-xl font-semibold text-gray-900 mt-1">Create your account</h2>
              </div>
              <div className="text-right text-[10px] text-gray-500">
                Already trusted by
                <br />
                <span className="font-semibold text-gray-900">12,000+</span> professionals
              </div>
            </div>

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
              <Field label="Join as" required>
                <div className="relative">
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    disabled={checkingAdmin}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-100 transition-all appearance-none cursor-pointer hover:border-gray-300"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Select your role</option>
                    <option value="JOB_SEEKER">Job Seeker</option>
                    <option value="EMPLOYER">Company</option>
                    {!adminExists && <option value="ADMIN">Admin</option>}
                  </select>
                </div>
              </Field>

              {formData.role === 'JOB_SEEKER' && (
                <>
                  <Field label="Full name" required>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="E.g. Sachithra Wijesinghe"
                    />
                  </Field>
                  <Field label="Contact number" required>
                    <input
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="+94 71 234 5678"
                    />
                  </Field>
                  <Field label="Country" required>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                    >
                      <option value="">Select country</option>
                      {[
                        'Sri Lanka',
                        'India',
                        'Singapore',
                        'United States',
                        'United Kingdom',
                        'Remote',
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                </>
              )}

              {formData.role === 'EMPLOYER' && step === 1 && (
                <>
                  <Field label="Company name" required>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="E.g. 360 Technologies"
                    />
                  </Field>
                  <Field label="Contact number" required>
                    <input
                      type="tel"
                      value={formData.companyContact}
                      onChange={(e) => setFormData({ ...formData, companyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="+94 71 234 5678"
                    />
                  </Field>
                </>
              )}

              {formData.role === 'ADMIN' && (
                <p className="text-xs text-gray-500">
                  Admin signup requires only email and password.
                </p>
              )}

              {formData.role === 'EMPLOYER' && (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1 rounded-full flex-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                  <div
                    className={`h-1 rounded-full flex-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                </div>
              )}

              {step === 2 && formData.role === 'EMPLOYER' && (
                <>
                  <Field label="Company address" required>
                    <input
                      type="text"
                      value={formData.companyAddress}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="Street, City, Country"
                    />
                  </Field>
                  <Field label="Registration number (optional)">
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, registrationNumber: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="Optional"
                    />
                  </Field>
                  <Field label="Category" required hint="Start typing to choose a category">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      list="company-categories"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="Technology, Finance, Marketing..."
                    />
                    <datalist id="company-categories">
                      {[
                        'Technology',
                        'Finance',
                        'Healthcare',
                        'Marketing',
                        'Retail',
                        'Education',
                        'Consulting',
                      ].map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Email address" required>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field label="Password" required>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                        placeholder="Create a secure password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-[10px] text-gray-500">
                      Must contain at least 8 characters, a number, and a mix of upper/lowercase
                      letters.
                    </p>
                  </Field>

                  <Field label="Confirm password" required>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all hover:border-gray-300"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-xs text-gray-500 text-center pt-1">
                    Already have an account?{' '}
                    <Link
                      href="/auth/signin"
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Sign in
                    </Link>
                  </p>

                  <label className="flex items-start gap-2.5 text-xs text-gray-500 pt-1">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </>
              )}

              <div className="flex items-center justify-between gap-2">
                {step === 2 && formData.role === 'EMPLOYER' && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 hover:bg-gray-200"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                >
                  {loading
                    ? 'Creating account...'
                    : formData.role === 'EMPLOYER' && step === 1
                      ? 'Next'
                      : 'Create account'}
                </button>
              </div>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                <span className="px-3 bg-white/95">or continue with</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-2xl opacity-40 cursor-not-allowed"
              >
                <LinkedinIcon />
                <span className="text-sm font-medium text-gray-500">Continue with LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
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
