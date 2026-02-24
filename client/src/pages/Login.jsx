import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, User, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login = ({ onLogin }) => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Database connection unavailable');
      }

      // Query based on role
      let query;
      if (role === 'student') {
        query = supabase.from('students').select('*').eq('email', username).single();
      } else if (role === 'teacher') {
        query = supabase.from('mentors').select('*').eq('email', username).single();
      } else {
        query = supabase.from('secretaries').select('*').eq('email', username).single();
      }

      const { data: userData, error } = await query;

      if (error || !userData) {
        setError('Invalid credentials');
        return;
      }

      // Simple password check (for demo - use proper auth in production)
      if (userData.password !== password) {
        setError('Invalid credentials');
        return;
      }

      // Successful login
      const user = {
        id: userData.id,
        studentId: userData.id,
        username: userData.name,
        email: userData.email,
        photo: userData.photo,
        role: role
      };

      onLogin(user);
      
      if (role === 'student') {
        navigate('/student');
      } else if (role === 'teacher') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell flex items-center justify-center px-6 relative overflow-hidden min-h-screen py-20">
      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl panel-card p-24 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-8 rounded-2xl bg-red-500/10 mb-10">
            <Shield className="text-red-500 w-12 h-12" />
          </div>
          <h2 className="text-5xl font-black heading-display text-white">Platform Access</h2>
          <p className="text-xs text-slate-500 mt-6 uppercase tracking-[0.3em] font-bold">
            Secure Identity Authentication
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Role Selector */}
          <div className="space-y-6">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 p-4 text-base focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Username */}
          <div className="space-y-6">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
              {role === 'student' ? 'Student Email' : 'Teacher Email'}
            </label>
            <div className="relative">
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 p-8 text-base focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                placeholder={
                  role === 'student'
                    ? 'student@kalvium.community'
                    : 'teacher@kalvium.community'
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-6">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 p-8 text-base focus:border-red-500 rounded-2xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-red-500"
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="hover:text-red-500 transition-colors font-medium"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-2xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Authenticating...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </Motion.div>
    </section>
  );
};

export default Login;
