// Content script to interact with web pages
console.log('Trap Eye content script loaded');

// Monitor for suspicious form submissions
document.addEventListener('submit', function(e) {
  const url = window.location.href;
  
  // Analyze page URL when forms are submitted
  chrome.runtime.sendMessage({
    action: 'analyzeUrl',
    url: url
  });
});

// Listen for analysis results from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showWarning' && request.score > 0.7) {
    showPageWarning(request.score, request.reasons, request.url);
  }
});

// Function to scan page for links and analyze them
function scanPageLinks() {
  // Get all links on the page
  const links = document.querySelectorAll('a[href]');
  
  // Send each link for analysis
  links.forEach(link => {
    const url = link.href;
    
    // Skip if not http/https
    if (!url.startsWith('http')) return;
    
    // Skip if already analyzed
    if (link.dataset.analyzed) return;
    
    // Mark as analyzed
    link.dataset.analyzed = 'true';
    
    // Send for analysis
    chrome.runtime.sendMessage({
      action: 'analyzeUrl',
      url: url
    });
  });
}

// Show warning banner on the page
function showPageWarning(score, reasons, url) {
  // Check if warning already exists to avoid duplicates
  if (document.getElementById('trap-eye-warning-banner')) {
    return;
  }
  
  // Check if page warnings are enabled
  chrome.storage.sync.get(['enablePageWarnings'], (settings) => {
    if (settings.enablePageWarnings !== false) {
      // Add warning banner to the page
      const warningBanner = document.createElement('div');
      warningBanner.id = 'trap-eye-warning-banner';
      warningBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #ff4444;
        color: white;
        padding: 15px;
        text-align: center;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      warningBanner.innerHTML = `
        <div>
          🚨 TRAP EYE WARNING: This site has a high risk score (${(score * 100).toFixed(1)}%). 
        </div>
        <button id="dismiss-warning" style="background: white; border: none; padding: 5px 10px; border-radius: 3px; color: #ff4444; cursor: pointer;">Dismiss</button>
      `;
      
      document.body.prepend(warningBanner);
      
      // Add event listener to dismiss button
      document.getElementById('dismiss-warning').addEventListener('click', function() {
        warningBanner.remove();
      });
    }
  });
}

// Scan page links when the page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanPageLinks);
} else {
  scanPageLinks();
}

// Also scan when the page content changes
const observer = new MutationObserver(scanPageLinks);
observer.observe(document.body, { childList: true, subtree: true });