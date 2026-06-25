import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineClipboardList, HiOutlineUserCircle } from 'react-icons/hi';

// Demo accounts for quick one-click login (seeded users)
const DEMO_USERS = [
  { name: 'Budi Santoso', email: 'budi@kanggo.com', password: 'password123' },
  { name: 'Siti Rahayu', email: 'siti@kanggo.com', password: 'password123' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(null); // email of user being quick-logged-in
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const doLogin = async (emailArg, passwordArg) => {
    try {
      await login(emailArg, passwordArg);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      if (err.response?.data?.errors) {
        const mapped = {};
        err.response.data.errors.forEach((e) => { mapped[e.field] = e.message; });
        setErrors(mapped);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await doLogin(email, password);
    setLoading(false);
  };

  const handleQuickLogin = async (user) => {
    if (loading || quickLoading) return;
    setEmail(user.email);
    setPassword(user.password);
    setErrors({});
    setQuickLoading(user.email);
    await doLogin(user.email, user.password);
    setQuickLoading(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-violet-500 rounded-2xl shadow-xl shadow-brand-500/25 mb-4">
            <HiOutlineClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-slate-400">Sign in to manage your tasks</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${errors.email ? 'border-red-500' : 'border-slate-600/50'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${errors.password ? 'border-red-500' : 'border-slate-600/50'}`}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="login-submit-button"
              className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Quick login — demo accounts (one click) */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-slate-700/60"></div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Login (Demo)</span>
              <div className="flex-1 h-px bg-slate-700/60"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  disabled={loading || quickLoading !== null}
                  className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-left hover:border-brand-500 hover:bg-slate-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-violet-500/20 text-brand-400 group-hover:text-brand-300 shrink-0">
                    {quickLoading === user.email
                      ? <span className="w-4 h-4 border-2 border-brand-400/40 border-t-brand-400 rounded-full animate-spin"></span>
                      : <HiOutlineUserCircle className="w-6 h-6" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-200 truncate">{user.name}</span>
                    <span className="block text-xs text-slate-500 truncate">{user.email}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
