const express = require('express');
const { google } = require('googleapis');
const { getAuthenticatedClient } = require('./auth');
const { scanEmails } = require('../services/emailService');
const { extractUnsubscribeLinks } = require('../services/emailParser');

const router = express.Router();

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (!req.session.tokens) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Scan emails and get insights
router.get('/scan', requireAuth, async (req, res) => {
  try {
    const auth = getAuthenticatedClient(req.session);
    const gmail = google.gmail({ version: 'v1', auth });

    // Get user's email
    const userEmail = req.session.user.email;

    // Scan emails from Promotions tab and other newsletters
    const results = await scanEmails(gmail, userEmail);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Email scan error:', error);
    res.status(500).json({ 
      error: 'Failed to scan emails', 
      message: error.message 
    });
  }
});

// Get unsubscribe links for a specific sender
router.get('/unsubscribe/:senderEmail', requireAuth, async (req, res) => {
  try {
    const auth = getAuthenticatedClient(req.session);
    const gmail = google.gmail({ version: 'v1', auth });
    const senderEmail = decodeURIComponent(req.params.senderEmail);

    // Get messages from this sender
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: `from:${senderEmail}`,
      maxResults: 10
    });

    const messages = response.data.messages || [];
    const unsubscribeLinks = [];

    for (const message of messages) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });

      const links = extractUnsubscribeLinks(msg.data);
      if (links.length > 0) {
        unsubscribeLinks.push(...links);
        break; // Use the first valid unsubscribe link found
      }
    }

    res.json({
      success: true,
      senderEmail,
      unsubscribeLinks: [...new Set(unsubscribeLinks)] // Remove duplicates
    });
  } catch (error) {
    console.error('Unsubscribe link extraction error:', error);
    res.status(500).json({ 
      error: 'Failed to extract unsubscribe links', 
      message: error.message 
    });
  }
});

module.exports = router;
