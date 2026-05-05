import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../api';

function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/admin/cases')
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const total = cases.length;
  const pending = cases.filter(c => c.status === 'Pending').length;
  const investigating = cases.filter(c => c.status === 'Investigating').length;
  const closed = cases.filter(c => c.status === 'Closed').length;

  return (
    <div>
      <h2>Admin Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Total Cases</h3>
          <p>{total}</p>
        </div>
        <div className="stat-box" style={{ borderTop: '4px solid #856404' }}>
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
        <div className="stat-box" style={{ borderTop: '4px solid #004085' }}>
          <h3>Investigating</h3>
          <p>{investigating}</p>
        </div>
        <div className="stat-box" style={{ borderTop: '4px solid #155724' }}>
          <h3>Closed</h3>
          <p>{closed}</p>
        </div>
      </div>

      <h3>All Submitted Cases</h3>
      {cases.length === 0 ? <p>No cases found.</p> : (
        <table className="table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Citizen Name</th>
              <th>NIC</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c._id}>
                <td>{c._id.slice(-6).toUpperCase()}</td>
                <td>{c.user_id?.name || 'Unknown'}</td>
                <td>{c.user_id?.nic || 'N/A'}</td>
                <td>{c.complaint_type}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td><span className={`status-badge status-${c.status}`}>{c.status}</span></td>
                <td><Link to={`/admin/case/${c._id}`}>Manage</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
