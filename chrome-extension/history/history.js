document.addEventListener('DOMContentLoaded', async function() {
  // Load and display history
  await loadHistory();
  
  // Setup event listeners
  document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
  document.getElementById('searchInput').addEventListener('input', filterHistory);
});

async function loadHistory() {
  try {
    // Get history from storage
    const result = await chrome.storage.local.get(['urlHistory']);
    const history = result.urlHistory || [];
    
    // Update stats
    updateStats(history);
    
    // Display history items
    displayHistoryItems(history);
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

function updateStats(history) {
  const totalAnalyses = history.length;
  const highRiskCount = history.filter(item => item.score > 0.7).length;
  const safeCount = history.filter(item => item.score <= 0.7).length;
  
  document.getElementById('totalAnalyses').textContent = totalAnalyses;
  document.getElementById('highRiskCount').textContent = highRiskCount;
  document.getElementById('safeCount').textContent = safeCount;
}

function displayHistoryItems(history) {
  const historyContainer = document.getElementById('historyItems');
  
  if (history.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🕒</div>
        <h3>No Analysis History</h3>
        <p>Analyze URLs to see them appear here</p>
      </div>
    `;
    return;
  }
  
  // Sort by timestamp (newest first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  historyContainer.innerHTML = sortedHistory.map(item => {
    const scorePercent = (item.score * 100).toFixed(1);
    let riskLevel, riskClass;
    
    if (item.score > 0.7) {
      riskLevel = 'High Risk';
      riskClass = 'high';
    } else if (item.score > 0.3) {
      riskLevel = 'Medium Risk';
      riskClass = 'medium';
    } else {
      riskLevel = 'Low Risk';
      riskClass = 'low';
    }
    
    const formattedTime = new Date(item.timestamp).toLocaleString();
    
    return `
      <div class="history-item" data-url="${item.url}">
        <div class="item-header">
          <p class="url-text">${item.url}</p>
          <button class="delete-btn" data-url="${item.url}">🗑️</button>
        </div>
        <div class="item-details">
          <div>
            <div class="timestamp">${formattedTime}</div>
          </div>
          <div class="risk-score ${riskClass}">${scorePercent}%</div>
          <div class="risk-label ${riskClass}">${riskLevel}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      deleteHistoryItem(url);
    });
  });
}

async function clearHistory() {
  if (!confirm('Are you sure you want to clear all history? This cannot be undone.')) {
    return;
  }
  
  try {
    await chrome.storage.local.set({ urlHistory: [] });
    await loadHistory();
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

async function deleteHistoryItem(urlToDelete) {
  try {
    const result = await chrome.storage.local.get(['urlHistory']);
    const history = result.urlHistory || [];
    
    // Filter out the item to delete
    const updatedHistory = history.filter(item => item.url !== urlToDelete);
    
    // Save updated history
    await chrome.storage.local.set({ urlHistory: updatedHistory });
    
    // Refresh display
    await loadHistory();
  } catch (error) {
    console.error('Error deleting history item:', error);
  }
}

function filterHistory() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const historyItems = document.querySelectorAll('.history-item');
  
  historyItems.forEach(item => {
    const url = item.getAttribute('data-url').toLowerCase();
    if (url.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}