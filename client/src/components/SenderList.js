import React, { useState } from 'react';
import './SenderList.css';
import SenderCard from './SenderCard';

function SenderList({ senders, onUnsubscribeClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('total'); // 'total', 'unread', 'name'

  const filteredSenders = senders.filter(sender => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sender.email.toLowerCase().includes(searchLower) ||
      (sender.name && sender.name.toLowerCase().includes(searchLower))
    );
  });

  const sortedSenders = [...filteredSenders].sort((a, b) => {
    switch (sortBy) {
      case 'unread':
        return b.unreadEmails - a.unreadEmails;
      case 'name':
        return (a.name || a.email).localeCompare(b.name || b.email);
      case 'total':
      default:
        return b.totalEmails - a.totalEmails;
    }
  });

  return (
    <div className="sender-list">
      <div className="sender-list-header">
        <h2>Newsletter Senders</h2>
        <div className="sender-list-controls">
          <input
            type="text"
            placeholder="Search senders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="total">Sort by Total</option>
            <option value="unread">Sort by Unread</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {sortedSenders.length === 0 ? (
        <div className="no-results">
          {searchTerm ? 'No senders found matching your search.' : 'No newsletter senders found.'}
        </div>
      ) : (
        <div className="sender-grid">
          {sortedSenders.map((sender) => (
            <SenderCard
              key={sender.email}
              sender={sender}
              onUnsubscribeClick={onUnsubscribeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SenderList;

