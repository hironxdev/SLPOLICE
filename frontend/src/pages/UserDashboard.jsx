import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../api';

function UserDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/cases/my')
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <Link to="/new-case"><button className="primary" style={{ width: 'auto' }}>+ File New Case</button></Link>
      </div>
      
      <h2>My Submitted Cases</h2>
      {cases.length === 0 ? <p>No cases submitted yet.</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Type</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c._id}>
                <td>{c._id.slice(-6).toUpperCase()}</td>
                <td>{c.complaint_type}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td><span className={`status-badge status-${c.status}`}>{c.status}</span></td>
                <td><Link to={`/case/${c._id}`}>View Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserDashboard;
