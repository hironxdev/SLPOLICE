import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchWithAuth } from '../api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nic: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Citizen Registration</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>NIC Number</label>
          <input type="text" name="nic" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <button type="submit" className="primary">Register</button>
      </form>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default Register;
