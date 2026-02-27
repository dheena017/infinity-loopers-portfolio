// Example React Component - Display Operatives List
import React, { useEffect, useState } from 'react';
import { formatUTCDate } from '../lib/date';

interface Operative {
  id: string;
  name: string;
  role: string;
  skills: string[];
  status: 'active' | 'inactive' | 'retired';
  created_at: string;
}

export function OperativesList() {
  const [operatives, setOperatives] = useState<Operative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperatives = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/operatives');
        if (!response.ok) throw new Error('Failed to fetch operatives');
        
        const data = await response.json();
        setOperatives(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOperatives();
  }, []);

  if (loading) return <div>Loading operatives...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Active Operatives</h2>
      <div className="operatives-grid">
        {operatives.map((operative) => (
          <div key={operative.id} className="operative-card">
            <h3>{operative.name}</h3>
            <p><strong>Role:</strong> {operative.role}</p>
            <p><strong>Status:</strong> {operative.status}</p>
            <p><strong>Skills:</strong> {operative.skills.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example - Display Missions with Operatives
export function MissionsWithOperatives() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/missions');
        const data = await response.json();
        setMissions(data.data || []);
      } catch (err) {
        console.error('Error fetching missions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  if (loading) return <div>Loading missions...</div>;

  return (
    <div>
      <h2>Current Missions</h2>
      {missions.map((mission) => (
        <div key={mission.id} className="mission-card">
          <h3>{mission.title}</h3>
          <p>{mission.description}</p>
          <p><strong>Status:</strong> {mission.status}</p>
          <p><strong>Start:</strong> {formatUTCDate(mission.start_date)} | <strong>End:</strong> {formatUTCDate(mission.end_date)}</p>
        </div>
      ))}
    </div>
  );
}

// Example - Update Student Profile
export function StudentEditor({ studentId }: { studentId: number }) {
  const [student, setStudent] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await fetch(`http://localhost:5000/api/students/${studentId}`);
      const data = await response.json();
      setStudent(data.data);
      setFormData(data.data);
    };

    fetchStudent();
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Student updated successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={formData.linkedin || ''}
        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
        placeholder="LinkedIn"
      />
      <input
        value={formData.github || ''}
        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
        placeholder="GitHub"
      />
      <button type="submit">Update</button>
    </form>
  );
}
