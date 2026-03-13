document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  loadSettings();
  
  // Setup event listeners
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
  
  const riskThreshold = document.getElementById('riskThreshold');
  const thresholdValue = document.getElementById('thresholdValue');
  
  riskThreshold.addEventListener('input', function() {
    thresholdValue.textContent = this.value;
  });
  
  // Add test connection button
  const testConnectionBtn = document.createElement('button');
  testConnectionBtn.id = 'testConnectionBtn';
  testConnectionBtn.className = 'secondary-btn';
  testConnectionBtn.textContent = 'Test Connection';
  testConnectionBtn.style.marginLeft = '10px';
  
  const apiUrlInput = document.getElementById('apiUrl');
  apiUrlInput.parentNode.insertBefore(testConnectionBtn, apiUrlInput.nextSibling);
  
  testConnectionBtn.addEventListener('click', testConnection);
});

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get([
      'enableRealTime',
      'riskThreshold',
      'enableNotifications',
      'enablePageWarnings',
      'apiUrl',
      'apiKey',
      'enableHistory',
      'autoDelete'
    ]);
    
    // Set default values if not set
    document.getElementById('enableRealTime').checked = result.enableRealTime !== false; // default true
    document.getElementById('riskThreshold').value = result.riskThreshold || 70;
    document.getElementById('thresholdValue').textContent = result.riskThreshold || 70;
    document.getElementById('enableNotifications').checked = result.enableNotifications !== false; // default true
    document.getElementById('enablePageWarnings').checked = result.enablePageWarnings !== false; // default true
    document.getElementById('apiUrl').value = result.apiUrl || 'http://localhost:8002'; // Changed default to 8002
    document.getElementById('apiKey').value = result.apiKey || '';
    document.getElementById('enableHistory').checked = result.enableHistory === true; // default false
    document.getElementById('autoDelete').checked = result.autoDelete === true; // default false
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings: ' + error.message, 'error');
  }
}

async function saveSettings() {
  try {
    const settings = {
      enableRealTime: document.getElementById('enableRealTime').checked,
      riskThreshold: parseInt(document.getElementById('riskThreshold').value),
      enableNotifications: document.getElementById('enableNotifications').checked,
      enablePageWarnings: document.getElementById('enablePageWarnings').checked,
      apiUrl: document.getElementById('apiUrl').value.trim(),
      apiKey: document.getElementById('apiKey').value.trim(),
      enableHistory: document.getElementById('enableHistory').checked,
      autoDelete: document.getElementById('autoDelete').checked
    };
    
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings: ' + error.message, 'error');
  }
}

async function resetSettings() {
  if (!confirm('Are you sure you want to reset all settings to their default values?')) {
    return;
  }
  
  try {
    const defaultSettings = {
      enableRealTime: true,
      riskThreshold: 70,
      enableNotifications: true,
      enablePageWarnings: true,
      apiUrl: 'http://localhost:8002', // Changed default to 8002
      apiKey: '',
      enableHistory: false,
      autoDelete: false
    };
    
    await chrome.storage.sync.set(defaultSettings);
    
    // Update UI to reflect defaults
    document.getElementById('enableRealTime').checked = true;
    document.getElementById('riskThreshold').value = 70;
    document.getElementById('thresholdValue').textContent = '70';
    document.getElementById('enableNotifications').checked = true;
    document.getElementById('enablePageWarnings').checked = true;
    document.getElementById('apiUrl').value = 'http://localhost:8002'; // Changed default to 8002
    document.getElementById('apiKey').value = '';
    document.getElementById('enableHistory').checked = false;
    document.getElementById('autoDelete').checked = false;
    
    showStatus('Settings reset to defaults!', 'success');
  } catch (error) {
    console.error('Error resetting settings:', error);
    showStatus('Error resetting settings: ' + error.message, 'error');
  }
}

async function testConnection() {
  const testBtn = document.getElementById('testConnectionBtn');
  const apiUrl = document.getElementById('apiUrl').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  
  if (!apiUrl) {
    showStatus('Please enter an API URL', 'error');
    return;
  }
  
  // Disable button during test
  testBtn.disabled = true;
  testBtn.textContent = 'Testing...';
  
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey ? `Bearer ${apiKey}` : ''
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'healthy') {
        showStatus('Connection successful! API is healthy.', 'success');
      } else {
        showStatus('Connection successful but API is not healthy.', 'warning');
      }
    } else {
      showStatus(`Connection failed with status ${response.status}`, 'error');
    }
  } catch (error) {
    console.error('Connection test error:', error);
    showStatus(`Connection failed: ${error.message}`, 'error');
  } finally {
    // Re-enable button
    testBtn.disabled = false;
    testBtn.textContent = 'Test Connection';
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
  
  // Auto-hide success message after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}