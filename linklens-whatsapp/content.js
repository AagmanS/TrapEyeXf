// LinkLens for WhatsApp - Content Script

console.log('LinkLens for WhatsApp content script loaded');

// Configuration
const API_ENDPOINT = 'http://127.0.0.1:8002/predict';
const REFRESH_INTERVAL = 3000; // Check for new messages every 3 seconds

// Store scanned URLs to avoid re-scanning
const scannedUrls = new Set();
// Store scan results
const scanResults = new Map();

// Initialize the scanner
function initScanner() {
  console.log('Initializing LinkLens for WhatsApp');
  
  // Start scanning for links
  setInterval(scanForLinks, REFRESH_INTERVAL);
  
  // Also scan when user scrolls
  document.addEventListener('scroll', debounce(scanForLinks, 1000));
  
  // Create floating panel
  createFloatingPanel();
  
  // Create toggle button
  createToggleButton();
  
  // Listen for scan results from background
  try {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Received message in content script:', request);
      if (request.action === 'scanResult') {
        handleScanResult(request.url, request.result);
      } else if (request.action === 'triggerScan') {
        // Manual scan trigger from popup
        console.log('Manual scan triggered');
        scanForLinks();
      }
    });
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
  
  // Initial scan
  setTimeout(scanForLinks, 2000);
}

// Scan for links in WhatsApp messages
function scanForLinks() {
  console.log('Scanning for links...');
  
  // Check if we're on WhatsApp Web
  if (!window.location.href.includes('web.whatsapp.com')) {
    console.log('Not on WhatsApp Web, skipping scan');
    return;
  }
  
  // Find all message elements in WhatsApp Web using updated selectors
  const messageSelectors = [
    '[data-testid="msg-container"]',
    '[data-testid="message-in"]',
    '[data-testid="message-out"]',
    '.message-in',
    '.message-out',
    '[class*="message"]'
  ];
  
  let messageElements = [];
  for (const selector of messageSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`Found ${elements.length} elements with selector: ${selector}`);
      messageElements = [...messageElements, ...elements];
    }
  }
  
  // Try alternative approach for newer WhatsApp Web versions
  if (messageElements.length === 0) {
    const allMessages = document.querySelectorAll('[role="row"]');
    console.log(`Found ${allMessages.length} row elements`);
    messageElements = [...allMessages];
  }
  
  console.log(`Total message elements found: ${messageElements.length}`);
  
  if (messageElements.length > 0) {
    messageElements.forEach((messageElement, index) => {
      // Find all links in the message
      const linkElements = messageElement.querySelectorAll('a[href]');
      
      if (linkElements.length > 0) {
        console.log(`Message ${index} contains ${linkElements.length} links`);
      }
      
      linkElements.forEach(linkElement => {
        const url = linkElement.href;
        
        // Skip if already scanned
        if (scannedUrls.has(url)) {
          console.log('URL already scanned:', url);
          return;
        }
        
        // Skip empty URLs or javascript links
        if (!url || url.startsWith('javascript:') || url.startsWith('mailto:')) {
          console.log('Skipping invalid URL:', url);
          return;
        }
        
        // Add to scanned set
        scannedUrls.add(url);
        
        console.log('Sending URL for scanning:', url);
        
        // Add loading indicator
        addIndicator(linkElement, 'loading', 'Analyzing...');
        
        // Send URL to background for scanning with error handling
        try {
          chrome.runtime.sendMessage({
            action: 'scanUrl',
            url: url
          }, (response) => {
            // Handle response if needed
            if (chrome.runtime.lastError) {
              console.error('Error sending message to background:', chrome.runtime.lastError);
              console.error('URL that failed to send:', url);
              updateIndicator(linkElement, 'error', 'Error');
              return;
            }
          });
        } catch (error) {
          console.error('Error sending message to background:', error);
          console.error('URL that failed to send:', url);
          updateIndicator(linkElement, 'error', 'Error');
        }
      });
    });
  } else {
    console.log('No message elements found to scan');
  }
}

// Handle scan results
function handleScanResult(url, result) {
  console.log('Handling scan result for', url, ':', result);
  
  // Store result
  scanResults.set(url, result);
  
  // Find and highlight links in the DOM
  highlightLinks(url, result);
  
  // Update floating panel
  updateFloatingPanel();
}

// Add indicator to link
function addIndicator(linkElement, type, text) {
  // Remove existing indicator
  const existingIndicator = linkElement.parentNode.querySelector('.linklens-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create indicator element
  const indicator = document.createElement('span');
  indicator.className = `linklens-indicator ${type}`;
  indicator.textContent = text;
  indicator.title = type === 'loading' ? 'Analyzing link...' : 
                   type === 'safe' ? 'This link appears safe' : 
                   type === 'risky' ? 'This link may be risky' : 'Error analyzing link';
  
  // Add indicator after the link
  linkElement.parentNode.insertBefore(indicator, linkElement.nextSibling);
}

// Update indicator
function updateIndicator(linkElement, type, text) {
  const indicator = linkElement.parentNode.querySelector('.linklens-indicator');
  if (indicator) {
    indicator.className = `linklens-indicator ${type}`;
    indicator.textContent = text;
  } else {
    // If no indicator exists, create one
    addIndicator(linkElement, type, text);
  }
}

// Highlight links based on risk score
function highlightLinks(url, result) {
  // Find all links with this URL
  const linkElements = document.querySelectorAll(`a[href="${url}"]`);
  
  console.log(`Found ${linkElements.length} link elements for URL:`, url);
  
  linkElements.forEach(linkElement => {
    if (result.status === 'error') {
      // Error case
      updateIndicator(linkElement, 'error', 'Error');
    } else {
      // Determine score and label
      const score = result.score || 0;
      const isSafe = score < 0.5; // Assuming score < 0.5 is safe
      
      // Update indicator
      updateIndicator(linkElement, isSafe ? 'safe' : 'risky', isSafe ? 'Safe' : 'Risky');
    }
  });
}

// Create floating panel
function createFloatingPanel() {
  // Check if panel already exists
  if (document.getElementById('linklens-panel')) {
    return;
  }
  
  const panel = document.createElement('div');
  panel.id = 'linklens-panel';
  
  panel.innerHTML = `
    <div id="linklens-panel-header">
      <h3 id="linklens-panel-title">LinkLens Analysis</h3>
      <button id="linklens-panel-close">×</button>
    </div>
    <div id="linklens-panel-content">
      <p id="linklens-panel-empty">No links analyzed yet</p>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Add event listeners
  document.getElementById('linklens-panel-close').addEventListener('click', () => {
    panel.style.display = 'none';
  });
}

// Update floating panel
function updateFloatingPanel() {
  const panel = document.getElementById('linklens-panel');
  if (!panel) return;
  
  const content = document.getElementById('linklens-panel-content');
  const emptyMessage = document.getElementById('linklens-panel-empty');
  
  if (scanResults.size === 0) {
    if (emptyMessage) {
      emptyMessage.style.display = 'block';
    }
    return;
  }
  
  if (emptyMessage) {
    emptyMessage.style.display = 'none';
  }
  
  // Clear existing content
  content.innerHTML = '';
  
  // Add each scanned link
  scanResults.forEach((result, url) => {
    const item = document.createElement('div');
    item.className = 'linklens-panel-item';
    
    const score = result.score || 0;
    const isSafe = score < 0.5;
    
    item.innerHTML = `
      <a href="${url}" target="_blank" class="linklens-panel-link">${truncateUrl(url, 40)}</a>
      <span class="linklens-panel-score ${result.status === 'error' ? 'error' : (isSafe ? 'safe' : 'risky')}">
        ${result.status === 'error' ? 'Error' : (isSafe ? 'Safe' : 'Risky')}
      </span>
    `;
    
    content.appendChild(item);
  });
}

// Create toggle button
function createToggleButton() {
  // Check if button already exists
  if (document.getElementById('linklens-toggle')) {
    return;
  }
  
  const button = document.createElement('button');
  button.id = 'linklens-toggle';
  button.innerHTML = '🔍';
  button.title = 'Toggle LinkLens Panel';
  
  document.body.appendChild(button);
  
  // Add event listener
  button.addEventListener('click', () => {
    const panel = document.getElementById('linklens-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  });
}

// Utility function to truncate URL
function truncateUrl(url, maxLength) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

// Utility function to debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Start the scanner when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScanner);
} else {
  initScanner();
}