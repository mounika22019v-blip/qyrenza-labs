import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup' | 'forgot-password';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, signup } = useEnergy();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signup(name, email, password, orgName);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRecoverySent(true);
    }, 500);
  };

  const handleQuickDemoLogin = async (type: 'mounika' | 'madhulika' | 'rajesh') => {
    setLoading(true);
    setError('');
    let demoEmail = 'n7282433@gmail.com';
    if (type === 'madhulika') {
      demoEmail = 'madhulika@qyrenza.io';
    } else if (type === 'rajesh') {
      demoEmail = 'facility.lead@qyrenza.io';
    }
    const demoPass = 'Qyrenza@2026';
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (res.success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            {mode === 'login' && 'Sign in to Qyrenza Labs'}
            {mode === 'signup' && 'Create Enterprise Account'}
            {mode === 'forgot-password' && 'Password Recovery'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Access your organization’s energy intelligence dashboard.'}
            {mode === 'signup' && 'Start monitoring facilities and optimizing power consumption.'}
            {mode === 'forgot-password' && 'Enter your registered email to receive a secure reset link.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Quick Demo Credentials shortcut */}
        {mode === 'login' && (
          <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
            <span className="text-[11px] font-medium text-slate-400 block mb-2">⚡ Instant One-Click Evaluation:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('mounika')}
                className="rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2 py-1.5 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors text-center"
              >
                Mounika (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('madhulika')}
                className="rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-2 py-1.5 text-[10px] font-semibold text-indigo-300 hover:bg-indigo-900/40 transition-colors text-center"
              >
                Madhulika (Product)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rajesh')}
                className="rounded-lg border border-purple-500/30 bg-purple-950/40 px-2 py-1.5 text-[10px] font-semibold text-purple-300 hover:bg-purple-900/40 transition-colors text-center"
              >
                Rajesh (Facility)
              </button>
            </div>
          </div>
        )}

        {/* Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Don't have an enterprise account? </span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('signup');
                }}
                className="text-xs font-medium text-cyan-400 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* Signup Mode */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Medapati Madhulika"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Organization Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Apex Engineering College"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account & Open Dashboard'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMode('login');
                }}
                className="text-xs font-medium text-cyan-400 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Mode */}
        {mode === 'forgot-password' && (
          <div>
            {recoverySent ? (
              <div className="text-center py-4 space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-white">Reset Link Dispatched</h4>
                <p className="text-xs text-slate-300">
                  A password reset authorization link has been routed to{' '}
                  <span className="font-mono text-cyan-300">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRecoverySent(false);
                    setMode('login');
                  }}
                  className="mt-3 w-full rounded-lg bg-slate-800 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Account Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 pl-9 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Transmitting...' : 'Send Recovery Instructions'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode('login');
                    }}
                    className="text-xs font-medium text-slate-400 hover:text-white"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
