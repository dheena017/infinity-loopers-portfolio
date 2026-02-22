import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HUD from './components/HUD';
import Home from './pages/Home';
import Operatives from './pages/Operatives';
import Collective from './pages/Collective';
import Expeditions from './pages/Expeditions';
import Transmissions from './pages/Transmissions';
import Login from './pages/Login';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('squad_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStudents(data);
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
      <HUD user={user} onLogout={handleLogout} />

      <main className="pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/operatives" element={<Operatives />} />
              <Route path="/expeditions" element={<Expeditions />} />
              <Route path="/team" element={<Collective students={students} user={user} setStudents={setStudents} />} />
              <Route path="/transmissions" element={<Transmissions />} />
            </Routes>
          </motion.div>
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
      <div className="relative min-h-screen bg-[#0f172a] text-slate-50 font-sans">
        {/* Background Decor */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        </div>

        <AppContent />
      </div>
    </Router>
  );
}

export default App;
