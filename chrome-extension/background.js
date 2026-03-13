// Background service worker for real-time monitoring
console.log('Trap Eye background service started');

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Skip if not http/https
  if (!details.url.startsWith('http')) return;
  
  // Check if real-time analysis is enabled
  chrome.storage.sync.get(['enableRealTime'], async (result) => {
    if (result.enableRealTime !== false) { // default true
      analyzeUrl(details.url).then(result => {
        if (result.score > 0.7) { // High risk threshold
          showWarningNotification(details.url, result.score);
        }
      }).catch(error => {
        console.error('Error analyzing URL:', error);
      });
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeUrl') {
    analyzeUrl(request.url).then(result => {
      // Send result back to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        action: 'showWarning',
        score: result.score,
        reasons: result.reasons,
        url: request.url
      });
      
      // Also show notification if high risk and notifications enabled
      chrome.storage.sync.get(['enableNotifications'], (settings) => {
        if ((settings.enableNotifications !== false) && result.score > 0.7) {
          showWarningNotification(request.url, result.score);
        }
      });
      
      sendResponse({ success: true, result: result });
    }).catch(error => {
      console.error('Error analyzing URL:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  }
  
  // Handle history tracking
  if (request.action === 'saveToHistory') {
    saveToHistory(request.url, request.result);
    sendResponse({ success: true });
    return true;
  }
  
  // Handle manual analysis request
  if (request.action === 'manualAnalyze') {
    analyzeUrl(request.url).then(result => {
      saveToHistory(request.url, result);
      sendResponse({ success: true, result: result });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

async function analyzeUrl(url) {
  try {
    // Get API settings
    const settings = await chrome.storage.sync.get(['apiUrl', 'apiKey']);
    const apiUrl = settings.apiUrl || 'http://localhost:8002'; // Changed default to 8002
    
    console.log('Analyzing URL:', url, 'using API:', apiUrl);
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': settings.apiKey ? `Bearer ${settings.apiKey}` : ''
      },
      body: JSON.stringify({ url: url })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const result = await response.json();
    
    // Save to history
    saveToHistory(url, result);
    
    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    return { score: 0, label: 'error', reasons: [`Analysis failed: ${error.message}`] };
  }
}

async function saveToHistory(url, result) {
  try {
    // Check if history tracking is enabled
    const settings = await chrome.storage.sync.get(['enableHistory']);
    if (!settings.enableHistory) {
      return;
    }
    
    // Get current history
    const historyResult = await chrome.storage.local.get(['urlHistory']);
    let history = historyResult.urlHistory || [];
    
    // Check if URL already exists in history
    const existingIndex = history.findIndex(item => item.url === url);
    
    const historyItem = {
      url: url,
      score: result.score,
      label: result.label,
      reasons: result.reasons,
      timestamp: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      // Update existing item
      history[existingIndex] = historyItem;
    } else {
      // Add new item
      history.unshift(historyItem); // Add to beginning
      
      // Limit history to 100 items
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
    }
    
    // Save updated history
    await chrome.storage.local.set({ urlHistory: history });
    console.log('Saved to history:', historyItem);
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

function showWarningNotification(url, score) {
  // Check if notifications are enabled
  chrome.storage.sync.get(['enableNotifications'], (settings) => {
    if (settings.enableNotifications !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🚨 Trap Eye Warning',
        message: `High risk URL detected (Score: ${(score * 100).toFixed(1)}%)`,
        buttons: [{ title: 'View Details' }],
        priority: 2
      }, (notificationId) => {
        // Store URL with notification ID for click handling
        chrome.storage.local.set({ [notificationId]: url });
      });
    }
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  // Get the URL associated with this notification
  chrome.storage.local.get([notificationId], (result) => {
    if (result[notificationId]) {
      // Open popup with the URL details
      chrome.action.openPopup();
    }
  });
});

// Clean up notification data when closed
chrome.notifications.onClosed.addListener((notificationId, byUser) => {
  chrome.storage.local.remove(notificationId);
});