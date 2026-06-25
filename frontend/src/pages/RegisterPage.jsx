import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineClipboardList } from 'react-icons/hi';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      if (err.response?.data?.errors) {
        const mapped = {};
        err.response.data.errors.forEach((e) => { mapped[e.field] = e.message; });
        setErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-violet-500 rounded-2xl shadow-xl shadow-brand-500/25 mb-4">
            <HiOutlineClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-slate-400">Start managing your tasks today</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  id="register-name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError('name'); }}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${errors.name ? 'border-red-500' : 'border-slate-600/50'}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${errors.email ? 'border-red-500' : 'border-slate-600/50'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${errors.password ? 'border-red-500' : 'border-slate-600/50'}`}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  id="register-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50'}`}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="register-submit-button"
              className="w-full py-3 mt-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
