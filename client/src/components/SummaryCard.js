import React from 'react';
import './SummaryCard.css';

function SummaryCard({ summary }) {
  if (!summary) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="summary-card">
      <h2>Inbox Overview</h2>
      <div className="summary-stats">
        <div className="stat-item">
          <div className="stat-value">{summary.totalEmails.toLocaleString()}</div>
          <div className="stat-label">Total Emails</div>
        </div>
        <div className="stat-item">
          <div className="stat-value unread">{summary.totalUnread.toLocaleString()}</div>
          <div className="stat-label">Unread</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{summary.uniqueSenders}</div>
          <div className="stat-label">Newsletter Senders</div>
        </div>
      </div>
      <div className="scan-date">
        Last scanned: {formatDate(summary.scanDate)}
      </div>
    </div>
  );
}

export default SummaryCard;

