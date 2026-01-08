import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import SenderList from '../components/SenderList';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard({ user, onLogout }) {
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadScanData();
  }, []);

  const loadScanData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/emails/scan', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to scan emails');
      }
      
      const data = await response.json();
      setScanData(data.data);
    } catch (error) {
      console.error('Scan error:', error);
      setError(error.message || 'Failed to scan emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRescan = async () => {
    setScanning(true);
    setError(null);
    try {
      const response = await fetch('/api/emails/scan', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to scan emails');
      }
      
      const data = await response.json();
      setScanData(data.data);
    } catch (error) {
      console.error('Rescan error:', error);
      setError(error.message || 'Failed to scan emails. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1>MailTrim</h1>
            </div>
            <p className="user-info">
              {user?.email && `Signed in as ${user.email}`}
            </p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <LoadingSpinner message="Scanning your inbox..." />
        ) : error ? (
          <div className="error-container">
            <div className="error-card">
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-button" onClick={loadScanData}>
                Try Again
              </button>
            </div>
          </div>
        ) : scanData ? (
          <>
            <div className="dashboard-top">
              <div className="dashboard-title">
                <h2>Your Inbox Overview</h2>
                <p>Manage your newsletters and keep your inbox clean</p>
              </div>
              <button 
                className="rescan-button" 
                onClick={handleRescan}
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <svg className="spinner-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="32">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.5 2V6H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 22V18H6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21.5 2L16 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 22L8 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 2L8.68 8.68C9.06 9.06 9.06 9.66 8.68 10.04L6.5 12.22C6.12 12.6 5.52 12.6 5.14 12.22L2.5 9.58" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21.5 22L15.32 15.32C14.94 14.94 14.94 14.34 15.32 13.96L17.5 11.78C17.88 11.4 18.48 11.4 18.86 11.78L21.5 14.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Rescan Inbox
                  </>
                )}
              </button>
            </div>

            <SummaryCard summary={scanData.summary} />

            <SenderList 
              senders={scanData.senders} 
              onUnsubscribeClick={(senderEmail) => {
                // Open unsubscribe link in new tab
                window.open(`/api/emails/unsubscribe/${encodeURIComponent(senderEmail)}`, '_blank');
              }}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}

export default Dashboard;
