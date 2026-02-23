// Simple test script to POST sample mentor, student, and teacher to local API
// Uses Node's global `fetch` (Node 18+). No external dependency required.

const API = 'http://localhost:5000';

async function post(path, body) {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log(path, '->', res.status, JSON.stringify(data));
  } catch (err) {
    console.error(path, 'ERROR', err.message || err);
  }
}

(async () => {
  console.log('Posting test mentor...');
  await post('/api/mentors', { name: 'Auto Mentor', role: 'Advisor', desc: 'Automated test mentor', photo: '/assets/mentor1.jpg', email: 'mentor@test' });

  console.log('Posting test student...');
  await post('/api/students', { name: 'Auto Student', role: 'Student', email: 'student@test', photo: '/assets/student1.jpg', bio: 'Automated student', term: 'Spring 2026', password: 'pass123' });

  console.log('Posting test teacher...');
  await post('/api/secretaries', { name: 'Auto Teacher', role: 'Teacher', email: 'teacher@test', photo: '/assets/Author1.jpg', bio: 'Automated teacher' });

  console.log('Done');
})();
