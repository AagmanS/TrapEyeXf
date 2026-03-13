// LinkLens for WhatsApp - Popup Script

document.addEventListener('DOMContentLoaded', function() {
  console.log('LinkLens popup loaded');
  
  // Get DOM elements
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  const scanButton = document.getElementById('scan-button');
  const settingsButton = document.getElementById('settings-button');
  
  // Check backend connection
  checkBackendConnection();
  
  // Add event listeners
  scanButton.addEventListener('click', function() {
    scanCurrentChat();
  });
  
  settingsButton.addEventListener('click', function() {
    // Open extension settings/options page
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      console.log('Options page not available');
    }
  });
});

// Check connection to FastAPI backend
async function checkBackendConnection() {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  
  try {
    // Try to connect to the backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('http://127.0.0.1:8002/health', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      statusIndicator.className = 'status-indicator connected';
      statusText.textContent = `Connected (v${data.version || '1.0'})`;
    } else {
      throw new Error('Backend returned error status');
    }
  } catch (error) {
    console.error('Backend connection error:', error);
    statusIndicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Backend not connected';
  }
}

// Scan current chat
async function scanCurrentChat() {
  try {
    // Get active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    
    console.log('Active tab:', activeTab);
    
    if (!activeTab) {
      showError('No active tab found. Please open WhatsApp Web.');
      return;
    }
    
    console.log('Active tab URL:', activeTab.url);
    
    // Check if the active tab is WhatsApp Web
    if (!activeTab.url || !activeTab.url.includes('web.whatsapp.com')) {
      showError('Please open WhatsApp Web to scan links.\nCurrent URL: ' + (activeTab.url || 'No URL'));
      return;
    }
    
    // Send message to content script to trigger scan
    try {
      await chrome.tabs.sendMessage(activeTab.id, { action: 'triggerScan' });
      showSuccess('Scanning initiated! Check the chat for link indicators.');
    } catch (error) {
      console.error('Error sending message to content script:', error);
      showError('Error initiating scan. Make sure the LinkLens extension is properly loaded.\nError: ' + (error.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error triggering scan:', error);
    showError('Error initiating scan. Please make sure WhatsApp Web is open.\nError: ' + (error.message || 'Unknown error'));
  }
}

// Show error message
function showError(message) {
  // Create error container if it doesn't exist
  let errorContainer = document.getElementById('linklens-error');
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.id = 'linklens-error';
    errorContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #f44336;
      color: white;
      padding: 10px;
      z-index: 10000;
      font-size: 12px;
      text-align: center;
    `;
    document.body.appendChild(errorContainer);
  }
  
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  
  // Hide after 5 seconds
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

// Show success message
function showSuccess(message) {
  // Create success container if it doesn't exist
  let successContainer = document.getElementById('linklens-success');
  if (!successContainer) {
    successContainer = document.createElement('div');
    successContainer.id = 'linklens-success';
    successContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background: #4CAF50;
      color: white;
      padding: 10px;
      z-index: 10000;
      font-size: 12px;
      text-align: center;
    `;
    document.body.appendChild(successContainer);
  }
  
  successContainer.textContent = message;
  successContainer.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    successContainer.style.display = 'none';
  }, 3000);
}