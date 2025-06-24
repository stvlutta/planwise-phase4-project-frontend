import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <span className="theme-icon">
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
      <span className="theme-toggle-label">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

export default ThemeToggle;