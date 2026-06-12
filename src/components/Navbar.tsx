import { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import './Navbar.css';

export const Navbar = () => {
  const [isBackendUp, setIsBackendUp] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await checkHealth();
        setIsBackendUp(true);
      } catch (error) {
        setIsBackendUp(false);
      }
    };
    checkBackend();
  }, []);

  return (
    <nav className="navbar glass-card">
      <div className="navbar-logo">
        <h2>AI Software Architecture Reviewer</h2>
      </div>
      <div className="navbar-status">
        <span className={`status-dot ${isBackendUp ? 'up' : 'down'}`}></span>
        <span className="status-text">{isBackendUp ? 'Backend Online' : 'Backend Offline'}</span>
      </div>
    </nav>
  );
};
