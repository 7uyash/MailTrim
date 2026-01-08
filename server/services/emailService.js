const { extractUnsubscribeLinks } = require('./emailParser');

/**
 * Scan emails and group by sender, providing insights
 */
async function scanEmails(gmail, userEmail) {
  try {
    // Search for emails in Promotions category and newsletters
    // Using queries that typically match newsletters and promotional emails
    const queries = [
      'category:promotions',
      'is:unread category:promotions',
      'category:updates',
      'is:unread category:updates'
    ];

    const allMessages = [];
    const messageIds = new Set();

    // Collect messages from different queries
    for (const query of queries) {
      let pageToken = null;
      do {
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults: 500,
          pageToken: pageToken
        });

        if (response.data.messages) {
          for (const message of response.data.messages) {
            if (!messageIds.has(message.id)) {
              messageIds.add(message.id);
              allMessages.push(message);
            }
          }
        }

        pageToken = response.data.nextPageToken;
      } while (pageToken && allMessages.length < 2000); // Limit to prevent timeout
    }

    // Group messages by sender
    const senderMap = new Map();

    // Process messages in batches to avoid rate limits
    // Gmail API limit: 250 quota units per user per second
    // messages.get uses 5 quota units, so max ~50 requests/second
    const batchSize = 20; // Reduced batch size
    const delayBetweenBatches = 500; // 500ms delay between batches
    
    for (let i = 0; i < Math.min(allMessages.length, 500); i += batchSize) {
      const batch = allMessages.slice(i, i + batchSize);
      
      // Process batch with concurrency limit
      const concurrencyLimit = 5;
      for (let j = 0; j < batch.length; j += concurrencyLimit) {
        const concurrentBatch = batch.slice(j, j + concurrencyLimit);
        
        await Promise.all(concurrentBatch.map(async (message) => {
          try {
            const msg = await gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'metadata',
              metadataHeaders: ['From', 'Subject', 'Date', 'List-Unsubscribe', 'List-Unsubscribe-Post']
            });

            const headers = msg.data.payload.headers;
            const fromHeader = headers.find(h => h.name === 'From');
            const subjectHeader = headers.find(h => h.name === 'Subject');
            const dateHeader = headers.find(h => h.name === 'Date');
            const listUnsubscribe = headers.find(h => h.name === 'List-Unsubscribe');
            const listUnsubscribePost = headers.find(h => h.name === 'List-Unsubscribe-Post');

            if (!fromHeader) return;

            // Extract email from "Name <email@domain.com>" format
            const fromMatch = fromHeader.value.match(/<(.+?)>/) || fromHeader.value.match(/([\w\.-]+@[\w\.-]+\.\w+)/);
            const senderEmail = fromMatch ? fromMatch[1] || fromMatch[0] : fromHeader.value.trim();
            const senderName = fromHeader.value.replace(/<.+?>/, '').trim() || senderEmail;

            if (!senderMap.has(senderEmail)) {
              senderMap.set(senderEmail, {
                email: senderEmail,
                name: senderName,
                totalEmails: 0,
                unreadEmails: 0,
                latestEmailDate: null,
                hasUnsubscribeHeader: !!(listUnsubscribe || listUnsubscribePost),
                subjects: []
              });
            }

            const sender = senderMap.get(senderEmail);
            sender.totalEmails++;
            
            // If 'UNREAD' is in labelIds, the email is unread
            if (msg.data.labelIds && msg.data.labelIds.includes('UNREAD')) {
              sender.unreadEmails++;
            }

            const emailDate = dateHeader ? new Date(dateHeader.value) : new Date(msg.data.internalDate);
            if (!sender.latestEmailDate || emailDate > sender.latestEmailDate) {
              sender.latestEmailDate = emailDate;
            }

            if (subjectHeader && !sender.subjects.includes(subjectHeader.value)) {
              sender.subjects.push(subjectHeader.value);
              if (sender.subjects.length > 5) {
                sender.subjects.shift(); // Keep only last 5 subjects
              }
            }
          } catch (error) {
            // Handle rate limit errors gracefully
            if (error.message && error.message.includes('Quota exceeded')) {
              console.error(`Rate limit hit for message ${message.id}, skipping...`);
              return; // Skip this message
            }
            console.error(`Error processing message ${message.id}:`, error.message);
          }
        }));
        
        // Small delay between concurrent batches
        if (j + concurrencyLimit < batch.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Delay between main batches to respect rate limits
      if (i + batchSize < allMessages.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    // Convert map to array and sort by total emails
    const senders = Array.from(senderMap.values())
      .sort((a, b) => b.totalEmails - a.totalEmails);

    // Calculate summary statistics
    const totalEmails = senders.reduce((sum, s) => sum + s.totalEmails, 0);
    const totalUnread = senders.reduce((sum, s) => sum + s.unreadEmails, 0);
    const uniqueSenders = senders.length;

    return {
      summary: {
        totalEmails,
        totalUnread,
        uniqueSenders,
        scanDate: new Date().toISOString()
      },
      senders: senders.map(s => ({
        email: s.email,
        name: s.name,
        totalEmails: s.totalEmails,
        unreadEmails: s.unreadEmails,
        latestEmailDate: s.latestEmailDate,
        hasUnsubscribeHeader: s.hasUnsubscribeHeader,
        recentSubjects: s.subjects.slice(-3) // Last 3 subjects
      }))
    };
  } catch (error) {
    console.error('Error scanning emails:', error);
    throw error;
  }
}

module.exports = {
  scanEmails,
  extractUnsubscribeLinks
};

