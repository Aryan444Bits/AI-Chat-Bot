import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/form.css';

const Login = () => {
    return (
        <div className="form-container">
            <form className="form">
                <h2 className="form-title">Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" />
                </div>
                <button type="submit" className="form-button">Login</button>
                <p className="form-footer">
                    Don't have an account ? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
