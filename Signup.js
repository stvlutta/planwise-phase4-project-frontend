import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setFieldError }) => {
    setIsSubmitting(true);
    const result = await signup(values.username, values.email, values.password);
    
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
        <h1>Join PlanWise</h1>
        <p>Create your account to start planning and managing your projects efficiently.</p>
        
        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
              />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
              />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <ErrorMessage name="submit" component="div" className="error-message" />

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-primary btn-block"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </Form>
        </Formik

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;