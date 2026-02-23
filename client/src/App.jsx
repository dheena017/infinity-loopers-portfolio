import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ThreeScene from './components/ThreeScene';
import HUD from './components/HUD';
import Home from './pages/Home';
import Operatives from './pages/Operatives';
import Mentors from './pages/Mentors';
import Collective from './pages/Collective';
import Expeditions from './pages/Expeditions';
import Transmissions from './pages/Transmissions';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SecretaryDashboard from './pages/SecretaryDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import { motion as Motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('squad_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('squad_user');
  };

  const handleUserUpdate = (updates) => {
    // 1. Update the logged-in user object & localStorage (use functional update so
    //    we always have the latest prev value, no stale-closure issue)
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('squad_user', JSON.stringify(updated));
      return updated;
    });

    // 2. Patch the matching student card in the students[] list so the
    //    Collective/Team page also reflects the change instantly.
    //    We read studentId from the *current* user closure, not from localStorage.
    if (user?.studentId && (updates.username || updates.photo)) {
      setStudents(prev =>
        prev.map(s =>
          s.id === user.studentId
            ? {
              ...s,
              ...(updates.username ? { name: updates.username } : {}),
              ...(updates.photo ? { photo: updates.photo } : {}),
            }
            : s
        )
      );
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('squad_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setStudents(result.data || result);
      } catch (err) {
        console.warn('Backend offline, using fallback:', err.message);
        const fallback = Array.from({ length: 24 }, (_, i) => ({
          id: i + 1,
          name: `User_${i + 1}`,
          photo: `/assets/student${i + 1}.jpg`
        }));
        setStudents(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center font-sans z-[200]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full">
      <ThreeScene />
      <HUD user={user} onLogout={handleLogout} />

      <main className="min-h-screen pt-24 md:pt-32">
        <AnimatePresence mode="wait">
          <Motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/operatives" element={<Operatives />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/expeditions" element={<Expeditions />} />
              <Route path="/team" element={<Collective students={students} user={user} setStudents={setStudents} />} />
              <Route path="/secretary" element={<SecretaryDashboard />} />
              <Route path="/student" element={<StudentDashboard user={user} onUpdate={handleUserUpdate} onLogout={handleLogout} />} />
              <Route path="/admin" element={<TeacherDashboard students={students} setStudents={setStudents} user={user} onUpdate={handleUserUpdate}/>} />
              <Route path="/transmissions" element={<Transmissions />} />
            </Routes>
          </Motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-20 border-t border-slate-800 text-center">
        <div className="text-2xl font-bold tracking-tight text-white/10 uppercase">Portfolio System</div>
        <div className="text-xs text-slate-500 mt-4 font-medium uppercase tracking-[0.2em]">Version 3.0.0 — Production Build</div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#030305] text-slate-50 font-sans">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
