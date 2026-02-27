import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Shield, User, AlertCircle, Loader2, ArrowRight, NotebookText, Pencil, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const FALLBACK_PASSWORD = 'kalvium@123';

const studentEmailAliases = {
    'mohamed.sharaf.s.@kalvium.community': 'mohamed.sharaf.s.139@kalvium.community',
    'imran.s.139@kalvium.community': 'imran.s.s.139@kalvium.community',
    'imran.s.s.139@kalvium.community': 'imran.s.139@kalvium.community',
    'nayeem.sajjath.m.139@kalvium.community': 'nayeem.sajjath.s.139@kalvium.community',
    'nayeem.sajjath.s.139@kalvium.community': 'nayeem.sajjath.m.139@kalvium.community'
};

const coreStudentEmails = new Set([
    'dheenadayalan.r.s.139@kalvium.community',
    'mohamed.sharaf.s.139@kalvium.community',
    'imran.s.139@kalvium.community',
    'imran.s.s.139@kalvium.community',
    'nayeem.sajjath.m.139@kalvium.community',
    'nayeem.sajjath.s.139@kalvium.community'
]);

const coreStudentFallbackProfiles = {
    'dheenadayalan.r.s.139@kalvium.community': { id: 36, name: 'Dheenadayalan', photo: '/assets/Author3.jpg' },
    'mohamed.sharaf.s.139@kalvium.community': { id: 28, name: 'Mohamed Sharaf', photo: '/assets/Author1.jpg' },
    'imran.s.139@kalvium.community': { id: 37, name: 'Imran', photo: '/assets/Author2.jpg' },
    'imran.s.s.139@kalvium.community': { id: 37, name: 'Imran', photo: '/assets/Author2.jpg' },
    'nayeem.sajjath.m.139@kalvium.community': { id: 26, name: 'Nayeem Sajjath', photo: '/assets/Author4.jpg' },
    'nayeem.sajjath.s.139@kalvium.community': { id: 26, name: 'Nayeem Sajjath', photo: '/assets/Author4.jpg' }
};

const normalizeEmail = (value) => (value || '').toString().trim().toLowerCase();

const getEmailCandidates = (normalizedEmail) => Array.from(new Set([
    normalizedEmail,
    studentEmailAliases[normalizedEmail]
].filter(Boolean)));

const getFallbackProfile = (normalizedEmail) => {
    const aliasedEmail = studentEmailAliases[normalizedEmail] || '';
    return coreStudentFallbackProfiles[normalizedEmail] || coreStudentFallbackProfiles[aliasedEmail];
};

const isCoreStudentEmail = (normalizedEmail) => {
    const aliasedEmail = studentEmailAliases[normalizedEmail] || '';
    return coreStudentEmails.has(normalizedEmail) || coreStudentEmails.has(aliasedEmail);
};

async function findStudentByEmailAndPassword(normalizedEmail, enteredPassword) {
    const emailCandidates = getEmailCandidates(normalizedEmail);
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

    if (error) {
        throw error;
    }

    const rows = Array.isArray(data) ? data : [];
    const emailMatches = rows.filter((item) => {
        const itemEmail = normalizeEmail(item?.email);
        return emailCandidates.includes(itemEmail);
    });

    if (emailMatches.length === 0) {
        return null;
    }

    const matchedByPassword = emailMatches.find((item) => {
        const storedPassword = (item?.password || FALLBACK_PASSWORD).toString().trim();
        return storedPassword === enteredPassword;
    });

    return matchedByPassword || emailMatches[0];
}

async function findMentorByEmail(normalizedEmail) {
    const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .ilike('email', normalizedEmail)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    return data[0];
}

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

            const normalizedEmail = normalizeEmail(username);

            // Query based on role
            let userData = null;
            const enteredPassword = password.trim();

            if (role === 'student') {
                userData = await findStudentByEmailAndPassword(normalizedEmail, enteredPassword);
            } else if (role === 'mentor') {
                userData = await findMentorByEmail(normalizedEmail);
            } else {
                throw new Error('Unsupported login role');
            }

            if (!userData) {
                const fallbackProfile = getFallbackProfile(normalizedEmail);

                if (role === 'student' && fallbackProfile && enteredPassword === FALLBACK_PASSWORD) {
                    userData = {
                        id: fallbackProfile.id,
                        name: fallbackProfile.name,
                        email: normalizedEmail,
                        photo: fallbackProfile.photo,
                        password: FALLBACK_PASSWORD
                    };
                }
            }

            if (!userData) {
                setError('Invalid credentials');
                return;
            }

            // Simple password check (for demo - use proper auth in production)
            const storedPassword = (userData.password || FALLBACK_PASSWORD).toString().trim();
            const isCoreStudent = role === 'student' && isCoreStudentEmail(normalizedEmail);
            const isPasswordValid = storedPassword === enteredPassword || (isCoreStudent && enteredPassword === FALLBACK_PASSWORD);

            if (!isPasswordValid) {
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
            } else {
                navigate('/mentor');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center p-6 bg-transparent">
            <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-lg bg-[#080a0f]/80 backdrop-blur-2xl p-10 md:p-14 shadow-[0_0_80px_rgba(239,68,68,0.15)] border border-white/10 rounded-[2.5rem]"
            >
                {/* Header Decoration */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
                    <h1 className="text-4xl md:text-5xl font-black text-white heading-display tracking-tighter uppercase text-center mb-2">
                        System <span className="text-red-600 italic">Login</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Integrated Access Protocol</p>
                </div>
                <br></br>
                {/* Role Selectors */}
                <div className="flex justify-center gap-10 mb-12 border-b border-white/5 pb-10">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${role === 'student' ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${role === 'student' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                            <div className="relative">
                                <NotebookText size={22} className="absolute -top-1 -left-1" />
                                <Pencil size={20} className="translate-x-1 translate-y-1" />
                            </div>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Folks</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('mentor')}
                        className={`flex flex-col items-center gap-3 transition-all duration-300 ${role === 'mentor' ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
                    >
                        <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${role === 'mentor' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}>
                            <div className="relative">
                                <User size={22} className="absolute -top-1 -left-1" />
                                <Shield size={20} className="translate-x-1 translate-y-1" />
                            </div>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Mentors</span>
                    </button>
                </div>
                <br></br>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex flex-col items-center space-y-4 px-6">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center pl-0">
                            {role === 'student' ? 'Enter Registered Email' : 'Enter Mentor Email'}
                        </label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full max-w-[420px] bg-transparent border border-white/20 p-5 py-12 text-sm focus:border-red-500 rounded-3xl outline-none transition-all text-white font-medium placeholder:text-slate-800 text-center"
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                    <br></br>
                    <div className="flex flex-col items-center space-y-4 px-6">
                        <div className="w-full max-w-[420px] flex flex-col items-center gap-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                Protocol Password
                            </label>
                        </div>
                        <div className="relative w-full max-w-[420px]">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border border-white/20 p-5 py-12 text-sm focus:border-red-500 rounded-3xl outline-none transition-all text-white font-medium placeholder:text-slate-800 text-center"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-500 transition-colors"
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                        <Link to="/forgot-password" size={10} className="text-[10px] font-black text-red-600/60 hover:text-red-500 uppercase tracking-widest transition-colors text-center mt-2">
                            Forget Password?
                        </Link>
                    </div>

                    {error && (
                        <Motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle size={14} className="text-red-500" />
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{error}</p>
                        </Motion.div>
                    )}
                    <br></br>
                    <div className="flex flex-col items-center gap-6 pt-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex items-center justify-center bg-red-600 text-white w-48 h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_15px_30px_-5px_rgba(220,38,38,0.4)] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span>LOGIN</span>
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                        <p className="text-[10px] text-slate-700 uppercase tracking-widest font-black">
                            Security Level: High Integrity
                        </p>
                    </div>
                </form>
            </Motion.div>
        </section>
    );
};

export default Login;

