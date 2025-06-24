import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * AuthProvider wraps children with authentication context.
 * @param {object} props
 * @returns {JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async auth check
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally fetch user info here
      setUser({});
    }
    setLoading(false)
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const refreshSession = async () => {
    setLoading(true);
    // Simulate session refresh (replace with real API call as needed)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setUser({}); // Optionally fetch user info here
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    getAuthHeaders,
    isAuthenticated: !!token && !!user,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth is a custom hook to access authentication context.
 * @returns {object}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};