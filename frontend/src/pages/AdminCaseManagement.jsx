import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchWithAuth } from '../api';

function AdminCaseManagement() {
  const { id } = useParams();
  const [caseItem, setCaseItem] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [status, setStatus] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const loadData = () => {
    Promise.all([
      fetchWithAuth(`/cases/${id}`), // Admins can view any case details via this route too due to our backend check
      fetchWithAuth(`/admin/cases/${id}/updates`)
    ])
    .then(([caseData, updatesData]) => {
      setCaseItem(caseData);
      setStatus(caseData.status);
      setUpdates(updatesData);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`/admin/cases/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      loadData(); // refresh data
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      await fetchWithAuth(`/admin/cases/${id}/note`, {
        method: 'POST',
        body: JSON.stringify({ note: noteContent })
      });
      setNoteContent('');
      loadData(); // refresh data
    } catch (err) {
      alert("Error adding note: " + err.message);
    }
  };

  if (loading) return <div>Loading case...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!caseItem) return <div>Case not found</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin">← Back to Admin Dashboard</Link>
      </div>

      <div className="stats-grid">
        <div className="card" style={{ flex: 2 }}>
          <h2>Case Information</h2>
          <p><strong>ID:</strong> {caseItem._id}</p>
          <p><strong>Type:</strong> {caseItem.complaint_type}</p>
          <p><strong>Date Filed:</strong> {new Date(caseItem.created_at).toLocaleString()}</p>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', border: '1px solid #ddd' }}>
            <strong>Description:</strong>
            <p style={{ whiteSpace: 'pre-wrap' }}>{caseItem.description}</p>
          </div>

          {caseItem.files && caseItem.files.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Evidence Files</h3>
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <h3>Update Status</h3>
            <form onSubmit={handleStatusUpdate}>
              <div className="form-group">
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button type="submit" className="primary">Change Status</button>
            </form>
          </div>

          <div className="card">
            <h3>Officer Notes & Log</h3>
            <form onSubmit={handleAddNote} style={{ marginBottom: '15px' }}>
              <div className="form-group">
                <textarea 
                  rows="3" 
                  placeholder="Type an internal note..." 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="primary">Add Note</button>
            </form>

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
              {updates.length === 0 ? <p style={{ color: '#666', fontSize: '0.9em' }}>No updates logged yet.</p> : updates.map(update => (
                <div key={update._id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    {new Date(update.timestamp).toLocaleString()} - Officer {update.admin_id?.name || 'Unknown'}
                  </div>
                  <div>{update.note}</div>
                  {update.status_change && (
                    <div style={{ fontSize: '0.85em', fontWeight: 'bold' }}>Status changed to: {update.status_change}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCaseManagement;
