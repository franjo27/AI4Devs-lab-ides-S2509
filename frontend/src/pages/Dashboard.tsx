import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { candidateService } from '../services/candidateService';

interface Candidate {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  cvFilePath?: string;
}

const transformCandidate = (candidate: any) => ({
  id: candidate.id,
  name: typeof candidate.name === 'object' ? candidate.name.value : candidate.name,
  surname: typeof candidate.surname === 'object' ? candidate.surname.value : candidate.surname,
  email: typeof candidate.email === 'object' ? candidate.email.value : candidate.email,
  phone: typeof candidate.phone === 'object' ? candidate.phone.value : candidate.phone,
  address: typeof candidate.address === 'object' ? candidate.address.value : candidate.address,
  education: typeof candidate.education === 'object' ? candidate.education.value : candidate.education,
  experience: typeof candidate.experience === 'object' ? candidate.experience.value : candidate.experience,
  cvFilePath: candidate.cvFilePath
});

export const Dashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getAllCandidates();
        const transformedCandidates = (response.data || []).map(transformCandidate);
        setCandidates(transformedCandidates);
        setError(null);
      } catch (err) {
        setError('Error loading candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div className="flex items-center justify-between">
          <h1>Candidate Dashboard</h1>
          <Link to="/add-candidate" className="btn-primary">
            + Add Candidate
          </Link>
        </div>
      </div>

      {loading && <div className="success-message">Loading candidates...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Education</th>
              <th>Experience</th>
              <th>CV</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                  No candidates found.
                </td>
              </tr>
            ) : (
              candidates.map(candidate => (
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.surname}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.education}</td>
                  <td>{candidate.experience}</td>
                  <td>
                    {candidate.cvFilePath ? (
                      <a href={candidate.cvFilePath} target="_blank" rel="noopener noreferrer" style={{ color: '#457b9d', fontWeight: 500 }}>
                        Download
                      </a>
                    ) : (
                      <span style={{ color: '#aaa' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};