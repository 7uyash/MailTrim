import React, { useState } from 'react';
import './SenderCard.css';

function SenderCard({ sender, onUnsubscribeClick }) {
  const [loading, setLoading] = useState(false);
  const [unsubscribeLinks, setUnsubscribeLinks] = useState(null);
  const [error, setError] = useState(null);

  const handleUnsubscribe = async () => {
    if (unsubscribeLinks && unsubscribeLinks.length > 0) {
      // Open the first unsubscribe link in a new tab
      window.open(unsubscribeLinks[0], '_blank', 'noopener,noreferrer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/emails/unsubscribe/${encodeURIComponent(sender.email)}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to get unsubscribe link');
      }

      const data = await response.json();
      
      if (data.unsubscribeLinks && data.unsubscribeLinks.length > 0) {
        setUnsubscribeLinks(data.unsubscribeLinks);
        // Open the first link in a new tab
        window.open(data.unsubscribeLinks[0], '_blank', 'noopener,noreferrer');
      } else {
        setError('No unsubscribe link found for this sender');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setError('Failed to get unsubscribe link. You can try searching for "unsubscribe" in the email.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="sender-card">
      <div className="sender-header">
        <div className="sender-info">
          <h3 className="sender-name">{sender.name || sender.email}</h3>
          <p className="sender-email">{sender.email}</p>
        </div>
      </div>

      <div className="sender-stats">
        <div className="stat">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{sender.totalEmails}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Unread:</span>
          <span className="stat-value unread">{sender.unreadEmails}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Latest:</span>
          <span className="stat-value">{formatDate(sender.latestEmailDate)}</span>
        </div>
      </div>

      {sender.recentSubjects && sender.recentSubjects.length > 0 && (
        <div className="recent-subjects">
          <strong>Recent subjects:</strong>
          <ul>
            {sender.recentSubjects.map((subject, idx) => (
              <li key={idx} title={subject}>
                {subject.length > 50 ? `${subject.substring(0, 50)}...` : subject}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="sender-actions">
        {sender.hasUnsubscribeHeader && (
          <span className="unsubscribe-badge">Has unsubscribe link</span>
        )}
        <button
          className="unsubscribe-button"
          onClick={handleUnsubscribe}
          disabled={loading}
        >
          {loading ? 'Loading...' : unsubscribeLinks ? 'Open Unsubscribe Link' : 'Get Unsubscribe Link'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {unsubscribeLinks && unsubscribeLinks.length > 1 && (
        <div className="additional-links">
          <p>Additional unsubscribe options:</p>
          {unsubscribeLinks.slice(1).map((link, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="additional-link"
            >
              {link.length > 60 ? `${link.substring(0, 60)}...` : link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default SenderCard;

