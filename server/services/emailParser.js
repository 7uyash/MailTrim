/**
 * Extract unsubscribe links from email messages
 */
function extractUnsubscribeLinks(message) {
  const unsubscribeLinks = [];
  
  try {
    // Check headers first (List-Unsubscribe)
    const headers = message.payload?.headers || [];
    const listUnsubscribe = headers.find(h => 
      h.name && h.name.toLowerCase() === 'list-unsubscribe'
    );
    
    if (listUnsubscribe && listUnsubscribe.value) {
      // Parse List-Unsubscribe header
      // Format: <mailto:unsubscribe@example.com>, <https://example.com/unsubscribe>
      const links = listUnsubscribe.value.match(/<([^>]+)>/g);
      if (links) {
        links.forEach(link => {
          const url = link.replace(/[<>]/g, '');
          if (url.startsWith('http://') || url.startsWith('https://')) {
            unsubscribeLinks.push(url);
          } else if (url.startsWith('mailto:')) {
            // Convert mailto to a clickable link
            unsubscribeLinks.push(url);
          }
        });
      }
    }

    // Also check List-Unsubscribe-Post header (one-click unsubscribe)
    const listUnsubscribePost = headers.find(h => 
      h.name && h.name.toLowerCase() === 'list-unsubscribe-post'
    );
    
    if (listUnsubscribePost) {
      // This indicates one-click unsubscribe is available
      // We'll note this in the response
    }

    // Extract from email body if not found in headers
    if (unsubscribeLinks.length === 0) {
      const bodyText = extractBodyText(message);
      if (bodyText) {
        // Look for common unsubscribe patterns
        const patterns = [
          /(?:unsubscribe|opt.?out|remove|manage.?preferences)[\s\S]{0,200}?(https?:\/\/[^\s<>"']+)/i,
          /(https?:\/\/[^\s<>"']*(?:unsubscribe|optout|remove|preferences)[^\s<>"']*)/i,
          /<a[^>]+href=["']([^"']*(?:unsubscribe|optout|remove)[^"']*)["'][^>]*>/i
        ];

        patterns.forEach(pattern => {
          const matches = bodyText.match(pattern);
          if (matches) {
            const link = matches[1] || matches[0];
            if (link && (link.startsWith('http://') || link.startsWith('https://'))) {
              unsubscribeLinks.push(link);
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Error extracting unsubscribe links:', error);
  }

  return [...new Set(unsubscribeLinks)]; // Remove duplicates
}

/**
 * Extract plain text from email body
 */
function extractBodyText(message) {
  try {
    if (!message.payload) return '';

    // Recursively extract text from parts
    function extractFromPart(part) {
      if (!part) return '';

      if (part.body && part.body.data) {
        const data = part.body.data;
        const text = Buffer.from(data, 'base64').toString('utf-8');
        return text;
      }

      if (part.parts) {
        return part.parts.map(extractFromPart).join('\n');
      }

      return '';
    }

    return extractFromPart(message.payload);
  } catch (error) {
    console.error('Error extracting body text:', error);
    return '';
  }
}

module.exports = {
  extractUnsubscribeLinks,
  extractBodyText
};

