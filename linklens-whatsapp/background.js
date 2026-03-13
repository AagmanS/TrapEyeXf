// LinkLens for WhatsApp - Background Service Worker

console.log('LinkLens for WhatsApp background service started');

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background:', request);
  console.log('Sender:', sender);
  
  if (request.action === 'scanUrl') {
    console.log('Scanning URL:', request.url);
    
    // Handle the async scanning process
    scanUrl(request.url)
      .then(result => {
        console.log('Scan result:', result);
        // Send result back to content script
        if (sender.tab && sender.tab.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'scanResult',
            url: request.url,
            result: result
          }).catch(error => {
            console.error('Error sending message to content script:', error);
            console.error('Tab ID:', sender.tab.id);
            console.error('URL being scanned:', request.url);
            // Don't treat this as a critical error, just log it
          });
        } else {
          console.error('No tab ID found in sender - cannot send result back');
          console.error('Sender details:', sender);
        }
      })
      .catch(error => {
        console.error('Error scanning URL:', error);
        // Send error result back to content script
        const errorResult = { 
          status: 'error', 
          message: `Scan failed: ${error.message || 'Unknown error'}` 
        };
        
        if (sender.tab && sender.tab.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: 'scanResult',
            url: request.url,
            result: errorResult
          }).catch(err => {
            console.error('Error sending error message to content script:', err);
            console.error('Tab ID:', sender.tab.id);
            console.error('URL being scanned:', request.url);
            // Don't treat this as a critical error, just log it
          });
        } else {
          console.error('No tab ID found in sender - cannot send error back');
          console.error('Sender details:', sender);
        }
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
  
  // Handle test connection messages
  if (request.action === 'testConnection') {
    sendResponse({
      status: 'connected',
      timestamp: Date.now(),
      message: 'Background script is running'
    });
    return false; // Synchronous response
  }
});

// Scan a URL using the FastAPI backend
async function scanUrl(url) {
  try {
    console.log('Scanning URL with FastAPI backend:', url);
    
    // Check if we have a cached result
    const cachedResult = await getCachedResult(url);
    if (cachedResult) {
      console.log('Using cached result for URL:', url);
      return cachedResult;
    }
    
    // Send URL to the FastAPI backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch('http://127.0.0.1:8002/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('API response:', result);
    
    // Cache the result
    await cacheResult(url, result);
    
    return result;
  } catch (error) {
    console.error('Scan error:', error);
    
    // Check if it's a connection error
    if (error.name === 'TypeError' || error.message.includes('fetch') || error.name === 'AbortError') {
      return { 
        status: 'error', 
        message: 'Connection failed - make sure the FastAPI backend is running on port 8002' 
      };
    }
    
    return { 
      status: 'error', 
      message: `Scan failed: ${error.message || 'Unknown error'}` 
    };
  }
}

// Get cached result from storage
async function getCachedResult(url) {
  try {
    const cacheKey = `linklens_cache_${url}`;
    const result = await chrome.storage.local.get([cacheKey]);
    if (result[cacheKey]) {
      // Check if cache is still valid (less than 1 hour old)
      const cachedData = result[cacheKey];
      const now = Date.now();
      const cacheAge = now - cachedData.timestamp;
      
      if (cacheAge < 3600000) { // 1 hour in milliseconds
        return cachedData.result;
      } else {
        // Remove expired cache
        await chrome.storage.local.remove([cacheKey]);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cached result:', error);
    return null;
  }
}

// Cache result in storage
async function cacheResult(url, result) {
  try {
    const cacheKey = `linklens_cache_${url}`;
    const cacheData = {
      timestamp: Date.now(),
      result: result
    };
    await chrome.storage.local.set({ [cacheKey]: cacheData });
  } catch (error) {
    console.error('Error caching result:', error);
  }
}