import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/form.css';
import { authAPI } from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate =  useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const response = await authAPI.login({
                email: formData.email,
                password: formData.password
            });
            console.log('Login successful:', response);
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
            
            // Check if it's a user not found error (400 status with "Invalid Email" message)
            if (error.response?.status === 400 && 
                error.response?.data?.message?.toLowerCase().includes('invalid email')) {
                setError('User not found! Please register first or check your email address.');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="form-title">Login</h2>
                {error && (
                    <div className="error-message" style={{
                        color: '#e74c3c',
                        backgroundColor: '#fdf2f2',
                        border: '1px solid #e74c3c',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px'
                    }}>
                        {error}
                        {error.includes('User not found') && (
                            <div style={{ marginTop: '8px' }}>
                                <Link to="/register" style={{ 
                                    color: '#3498db', 
                                    textDecoration: 'underline',
                                    fontWeight: 'bold'
                                }}>
                                    Click here to register →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                </div>
                <button type="submit" className="form-button" disabled={submitting}>
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
                <p className="form-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
