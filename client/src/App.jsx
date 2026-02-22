import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ThreeScene from './components/ThreeScene';
import HUD from './components/HUD';
import CustomCursor from './components/CustomCursor';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Operatives from './pages/Operatives';
import Collective from './pages/Collective';
import Expeditions from './pages/Expeditions';
import Transmissions from './pages/Transmissions';
import Login from './pages/Login';
import { Activity, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
    // Check for saved session
    const savedUser = localStorage.getItem('squad_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchData = async () => {

      try {
        console.log("Initiating data fetch...");
        const response = await fetch('http://localhost:5000/api/students');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const studentList = Array.isArray(data) ? data : Object.entries(data).map(([id, info]) => ({ id: Number(id), ...info }));

        const processed = studentList.map(s => ({
          ...s,
          photo: s.id <= 24 ? `/assets/student${s.id}.jpg` : `https://ui-avatars.com/api/?name=${s.name}&background=0891b2&color=fff&size=512`
        }));
        setStudents(processed);
      } catch (err) {
        console.warn('Backend offline or error, using fallback data:', err.message);
        const fallback = Array.from({ length: 24 }, (_, i) => ({
          id: i + 1,
          name: `Cadet_${i + 1}`,
          photo: `/assets/student${i + 1}.jpg`
        }));
        setStudents(fallback);
        // We don't set error to true here because we have fallback data
      } finally {
        // Ensure loading is cleared
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030305] flex flex-col items-center justify-center font-space z-[200]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-32 h-32 mb-12"
        >
          <div className="absolute inset-0 border border-cyan-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-t border-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-full">
            <Activity size={40} className="text-cyan-400 animate-pulse" />
          </div>
        </motion.div>
        <div className="text-cyan-400 tracking-[1.5em] text-[10px] animate-pulse uppercase font-black italic">
          SYNCING_COSMIC_DATA
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030305] text-white overflow-hidden scanline">
      <CustomCursor />
      <div className="grain-overlay" />

      {/* Background Layer */}
      <ThreeScene isInitialized={isInitialized} />

      {/* UI Layers */}
      <AnimatePresence mode="wait">
        {!isInitialized ? (
          <Landing onInitiate={() => setIsInitialized(true)} />
        ) : (
          <div key="main-app" className="relative z-10 font-inter">
            <HUD user={user} onLogout={handleLogout} />
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/operatives" element={<Operatives />} />
                <Route path="/expeditions" element={<Expeditions />} />
                <Route path="/the-crew" element={<Collective students={students} user={user} setStudents={setStudents} />} />
                <Route path="/transmissions" element={<Transmissions />} />
              </Routes>
            </motion.div>

            <footer className="py-24 bg-black/60 text-center relative z-20 border-t border-white/5">
              <div className="text-[10vw] font-black text-white/5 leading-none select-none italic uppercase font-space">INFIN_LOOP</div>
              <div className="text-[10px] text-white/10 mt-8 tracking-[1em]">SQ139_VOYAGER_EXT_v2.0.0</div>
            </footer>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
