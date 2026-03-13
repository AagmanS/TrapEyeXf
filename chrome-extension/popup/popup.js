document.addEventListener('DOMContentLoaded', async function() {
  // Get current tab URL
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  document.getElementById('currentUrl').textContent = truncateUrl(tab.url, 60);
  
  // Analyze current page
  document.getElementById('analyzeBtn').addEventListener('click', async () => {
    await analyzeAndDisplay(tab.url);
  });
  
  // Analyze custom URL
  document.getElementById('analyzeCustom').addEventListener('click', async () => {
    const customUrl = document.getElementById('customUrl').value.trim();
    if (customUrl) {
      // Add http:// if no protocol is specified
      const url = customUrl.startsWith('http') ? customUrl : 'http://' + customUrl;
      await analyzeAndDisplay(url);
    } else {
      showError('Please enter a URL to analyze');
    }
  });
  
  // Handle Enter key in custom URL input
  document.getElementById('customUrl').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      document.getElementById('analyzeCustom').click();
    }
  });
  
  // Options button
  document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // History button
  document.getElementById('historyBtn').addEventListener('click', () => {
    // Open history page in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('history/history.html') });
  });
  
  // Auto-analyze current page on load
  await analyzeAndDisplay(tab.url);
});

async function analyzeAndDisplay(url) {
  const resultDiv = document.getElementById('result');
  const statusDiv = document.getElementById('status');
  
  try {
    statusDiv.textContent = 'Analyzing...';
    statusDiv.className = 'status analyzing';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <p>🔍 Analyzing URL features with AI...</p>
        <p class="loading-url">${truncateUrl(url, 50)}</p>
      </div>
    `;
    
    // Send message to background script for analysis
    const response = await chrome.runtime.sendMessage({
      action: 'manualAnalyze',
      url: url
    });
    
    if (response.success) {
      // Display results
      displayResults(response.result);
      statusDiv.textContent = 'Analysis Complete';
      statusDiv.className = 'status complete';
    } else {
      throw new Error(response.error);
    }
    
  } catch (error) {
    console.error('Analysis error:', error);
    statusDiv.textContent = 'Analysis Failed';
    statusDiv.className = 'status error';
    resultDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
}

function displayResults(data) {
  const resultDiv = document.getElementById('result');
  
  // Calculate percentage score
  const scorePercent = (data.score * 100).toFixed(1);
  
  // Determine risk level and styling
  let riskLevel, riskClass;
  if (scorePercent > 70) {
    riskLevel = 'HIGH RISK';
    riskClass = 'high';
  } else if (scorePercent > 30) {
    riskLevel = 'MEDIUM RISK';
    riskClass = 'medium';
  } else {
    riskLevel = 'LOW RISK';
    riskClass = 'low';
  }
  
  // Format reasons properly
  let reasonsHtml = '<ul>';
  if (data.reasons && data.reasons.length > 0) {
    reasonsHtml += data.reasons.map(reason => `<li>${reason}</li>`).join('');
  } else {
    reasonsHtml += '<li>No strong indicators detected</li>';
  }
  reasonsHtml += '</ul>';
  
  // Format feature impact with detailed descriptions
  let featuresHtml = '<div class="feature-list">';
  if (data.explainability && Array.isArray(data.explainability) && data.explainability.length > 0) {
    // Sort by impact magnitude
    const sortedFeatures = [...data.explainability].sort((a, b) => {
      const impactA = Math.abs(parseFloat(a.impact));
      const impactB = Math.abs(parseFloat(b.impact));
      return impactB - impactA;
    });
    
    featuresHtml += sortedFeatures
      .slice(0, 8) // Top 8 features
      .map(feature => {
        const impactValue = parseFloat(feature.impact);
        const impactText = impactValue >= 0 ? `+${impactValue.toFixed(2)}` : impactValue.toFixed(2);
        const impactClass = impactValue > 0 ? 'negative' : impactValue < 0 ? 'positive' : 'neutral';
        
        return `
          <div class="feature-item">
            <div class="feature-header">
              <strong>${feature.feature}</strong>
              <span class="feature-impact ${impactClass}">${impactText}</span>
            </div>
            <div class="feature-details">
              <span class="feature-value">Value: ${feature.value}</span>
              <span class="feature-description">${feature.description}</span>
            </div>
          </div>
        `;
      })
      .join('');
  } else {
    featuresHtml += '<div class="feature-item">Feature analysis completed</div>';
  }
  featuresHtml += '</div>';
  
  // Determine confidence level and styling
  let confidenceLevel, confidenceClass;
  const confidence = data.confidence || 0.95; // Default to high confidence
  if (confidence > 0.8) {
    confidenceLevel = 'High';
    confidenceClass = 'high';
  } else if (confidence > 0.5) {
    confidenceLevel = 'Medium';
    confidenceClass = 'medium';
  } else {
    confidenceLevel = 'Low';
    confidenceClass = 'low';
  }
  
  resultDiv.innerHTML = `
    <div class="score-container">
      <div class="score-label">Risk Score</div>
      <div class="score-value">${scorePercent}%</div>
      <div class="risk-level ${riskClass}">${riskLevel}</div>
    </div>
    
    <div class="details-section">
      <div class="section-title">
        <span class="icon">❗</span>
        <span>Key Indicators</span>
      </div>
      <div class="reasons">${reasonsHtml}</div>
    </div>
    
    <div class="details-section">
      <div class="section-title">
        <span class="icon">📊</span>
        <span>Feature Analysis</span>
      </div>
      <div class="features">${featuresHtml}</div>
    </div>
    
    <div class="confidence-section">
      <div class="section-title">
        <span class="icon">📈</span>
        <span>Model Confidence: ${Math.round(confidence * 100)}%</span>
      </div>
      <div class="confidence-meter">
        <div class="confidence-bar">
          <div class="confidence-fill ${confidenceClass}" style="width: ${confidence * 100}%"></div>
        </div>
        <div class="confidence-label">${confidenceLevel}</div>
      </div>
    </div>
  `;
}

function truncateUrl(url, maxLength) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

function showError(message) {
  const resultDiv = document.getElementById('result');
  const statusDiv = document.getElementById('status');
  
  statusDiv.textContent = 'Error';
  statusDiv.className = 'status error';
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `<div class="error">${message}</div>`;
}