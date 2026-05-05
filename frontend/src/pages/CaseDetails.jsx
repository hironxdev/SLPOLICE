import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchWithAuth } from '../api';

function CaseDetails() {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWithAuth(`/cases/${id}`)
      .then(data => {
        setCaseItem(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!caseItem) return <div>Case not found</div>;

  return (
    <div className="card">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>

      <h2>Case Details: {caseItem._id}</h2>
      <p><strong>Type:</strong> {caseItem.complaint_type}</p>
      <p><strong>Date Filed:</strong> {new Date(caseItem.created_at).toLocaleString()}</p>
      <p>
        <strong>Status:</strong> 
        <span className={`status-badge status-${caseItem.status}`} style={{ marginLeft: '10px' }}>
          {caseItem.status}
        </span>
      </p>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', border: '1px solid #ddd' }}>
        <strong>Description:</strong>
        <p style={{ whiteSpace: 'pre-wrap' }}>{caseItem.description}</p>
      </div>

      {caseItem.files && caseItem.files.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Evidence</h3>
          <ul>
            {caseItem.files.map(file => (
              <li key={file._id}>
                <a href={`http://localhost:5000/${file.file_path}`} target="_blank" rel="noreferrer">
                  View File
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CaseDetails;
