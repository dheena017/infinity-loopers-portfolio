import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, User, LogIn, AlertCircle, Loader2, ArrowRight, NotebookText, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
        <section className="min-h-screen flex items-center justify-center p-6 bg-black">
            <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md aspect-square panel-card flex flex-col justify-center p-8 md:p-12 shadow-[0_0_50px_rgba(220,38,38,0.1)] border-white/5"
            >
                {/* Role Selectors */}
                <div className="flex justify-center gap-8 mb-10">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${role === 'student' ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${role === 'student' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                            <div className="relative">
                                <NotebookText size={20} className="absolute -top-1 -left-1" />
                                <Pencil size={18} className="translate-x-1 translate-y-1" />
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Folks</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${role === 'teacher' ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${role === 'teacher' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                            <div className="relative">
                                <User size={20} className="absolute -top-1 -left-1" />
                                <Shield size={18} className="translate-x-1 translate-y-1" />
                            </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mentors</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 p-4 text-sm focus:border-red-500 rounded-xl outline-none transition-all text-white font-medium placeholder:text-slate-700 text-center"
                            placeholder={role === 'student' ? 'Email Address' : 'Username'}
                            required
                        />
                    </div>
                   
<br></br>
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 p-4 text-sm focus:border-red-500 rounded-xl outline-none transition-all text-white font-medium placeholder:text-slate-700 text-center"
                            placeholder="Password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-wider">{error}</p>
                    )}
<br></br>
                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-32 py-3 bg-red-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[9px] text-slate-700 uppercase tracking-widest font-black leading-loose">
                        Secure Access Portal
                    </p>
                </div>
            </Motion.div>
        </section>
    );
};

export default Login;
