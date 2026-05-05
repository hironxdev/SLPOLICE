import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../api';

function NewCase() {
  const [formData, setFormData] = useState({
    complaint_type: 'Theft',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create Case
      const caseItem = await fetchWithAuth('/cases', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // 2. Upload File if selected
      if (file) {
        const fileData = new FormData();
        fileData.append('file', file);
        fileData.append('case_id', caseItem._id);
        
        await fetchWithAuth('/upload', {
          method: 'POST',
          body: fileData
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>Submit New Case</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Complaint Type</label>
          <select 
            value={formData.complaint_type} 
            onChange={(e) => setFormData({...formData, complaint_type: e.target.value})}
          >
            <option value="Theft">Theft</option>
            <option value="Fraud">Fraud</option>
            <option value="Assault">Assault</option>
            <option value="Cybercrime">Cybercrime</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description of Incident</label>
          <textarea 
            rows="5" 
            required 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Upload Evidence (Optional)</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" className="primary">Submit Case</button>
      </form>
    </div>
  );
}

export default NewCase;
