import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AuthPage.css';

function AuthPage({ onAuthSuccess }) {
  const [authUrl, setAuthUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    fetchAuthUrl();
  }, [searchParams]);

  const fetchAuthUrl = async () => {
    try {
      const response = await fetch('/api/auth/url');
      const data = await response.json();
      setAuthUrl(data.authUrl);
      setLoading(false);
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      setError('Failed to initialize authentication. Please refresh the page.');
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>MailTrim</span>
          </div>
          <button 
            className="header-cta" 
            onClick={handleConnect}
            disabled={!authUrl || loading}
          >
            {loading ? 'Loading...' : 'Get Started'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-visual">
            <div className="email-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="floating-elements">
              <div className="float-1"></div>
              <div className="float-2"></div>
              <div className="float-3"></div>
            </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-title">MailTrim</h1>
            <p className="hero-subtitle">Take control of your inbox. Understand and manage newsletters without the clutter.</p>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            <button 
              className="cta-button" 
              onClick={handleConnect}
              disabled={!authUrl || loading}
            >
              {loading ? 'Preparing...' : 'Connect Gmail Account'}
            </button>
            <p className="hero-note">Read-only access • No emails deleted • Privacy protected</p>
          </div>
        </div>
      </section>

      {/* What is MailTrim */}
      <section className="info-section">
        <div className="container">
          <h2 className="section-title">What is MailTrim?</h2>
          <p className="section-description">
            MailTrim is a clean, read-only Gmail utility that helps you instantly understand and control 
            the newsletters cluttering your inbox. After securely connecting your Gmail account with read-only 
            access, MailTrim scans your Promotions and newsletter emails to identify every mailing list you're 
            subscribed to, groups emails by sender, and shows you clear insights.
          </p>
        </div>
      </section>

      {/* Journey Map */}
      <section className="journey-section">
        <div className="container">
          <h2 className="section-title">Your Journey to a Cleaner Inbox</h2>
          <div className="journey-map">
            <div className="journey-step">
              <div className="journey-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Connect</h3>
              <p>Securely authenticate with Gmail using read-only OAuth2 access</p>
            </div>
            <div className="journey-connector"></div>
            <div className="journey-step">
              <div className="journey-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Scan</h3>
              <p>Automatically analyze your Promotions and Updates categories</p>
            </div>
            <div className="journey-connector"></div>
            <div className="journey-step">
              <div className="journey-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 10V3H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Analyze</h3>
              <p>View insights grouped by sender with statistics and trends</p>
            </div>
            <div className="journey-connector"></div>
            <div className="journey-step">
              <div className="journey-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Unsubscribe</h3>
              <p>Find and open official unsubscribe links with one click</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Built It */}
      <section className="info-section alt">
        <div className="container">
          <h2 className="section-title">Why We Built MailTrim</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Read-Only Access</h3>
              <p>No emails are deleted, modified, or sent on your behalf. MailTrim only reads your email metadata.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Privacy First</h3>
              <p>No private message content is stored. Everything is processed transparently in real-time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Instant Insights</h3>
              <p>Quickly understand which newsletters are taking up space in your inbox without manual searching.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Clean & Simple</h3>
              <p>A calmer, more intentional inbox where important emails stand out, without breaking Gmail rules or user trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to clean your inbox?</h2>
          <p>Connect your Gmail account and start taking control of your newsletters today.</p>
          <button 
            className="cta-button large" 
            onClick={handleConnect}
            disabled={!authUrl || loading}
          >
            {loading ? 'Preparing...' : 'Get Started Free'}
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="contact-section">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>MailTrim</span>
              </div>
              <p>Clean, read-only Gmail utility for managing newsletters</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#security">Security</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="mailto:support@mailtrim.com">Contact Us</a>
                <a href="#faq">FAQ</a>
                <a href="#privacy">Privacy Policy</a>
              </div>
              <div className="footer-column">
                <h4>Connect</h4>
                <a href="mailto:hello@mailtrim.com">hello@mailtrim.com</a>
                <div className="social-links">
                  <a href="#" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19C4 20.5 4 16.5 2 16M22 16V22C22 22.5304 21.7893 23.0391 21.4142 23.4142C21.0391 23.7893 20.5304 24 20 24H4C3.46957 24 2.96086 23.7893 2.58579 23.4142C2.21071 23.0391 2 22.5304 2 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 22V18C16 17.4696 15.7893 16.9609 15.4142 16.5858C15.0391 16.2107 14.5304 16 14 16H10C9.46957 16 8.96086 16.2107 8.58579 16.5858C8.21071 16.9609 8 17.4696 8 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2V8M12 8L15 5M12 8L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MailTrim. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthPage;
