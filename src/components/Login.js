import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username or email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

/**
 * Login component allows users to sign in to their account.
 * @returns {JSX.Element}
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setFieldError }) => {
    setIsSubmitting(true);
    const result = await login(values.username, values.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setFieldError('submit', result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login to PlanWise</h1>
        <p>Welcome back! Please sign in to continue.</p>
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username or email"
              />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
              />
              <label style={{ marginLeft: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                /> Show Password
              </label>
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <ErrorMessage name="submit" component="div" className="error-message" />

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-primary btn-block"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        </Formik>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Username:</strong> steve | <strong>Password:</strong> password123</p>
          <p><strong>Username:</strong> luke | <strong>Password:</strong> password123</p>
          <p><strong>Username:</strong> mudalib | <strong>Password:</strong> password123</p>
          <p><strong>Username:</strong> claire | <strong>Password:</strong> password123</p>
          <p><strong>Username:</strong> dylan | <strong>Password:</strong> password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;