# Trap Eye - Advanced Phishing Detection Chrome Extension

🛡️ Real-time ML-powered phishing URL detection with advanced security features

## Features

- **Real-time Analysis**: Automatically analyzes URLs as you browse
- **Smart Detection**: Uses advanced machine learning to identify phishing attempts
- **Visual Warnings**: Shows clear warnings on high-risk websites
- **Desktop Notifications**: Alerts you about dangerous sites
- **Detailed Analysis**: Provides comprehensive risk assessment with explanations
- **Privacy Focused**: Only sends URLs to your local analysis server
- **History Tracking**: Keeps track of analyzed URLs (optional)
- **Customizable Settings**: Adjust sensitivity and behavior to your preferences

## Installation

1. Make sure the phishing detection backend is running:
   ```bash
   python backend/main.py
   ```
   The backend should be accessible at `http://localhost:8000`

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked"

5. Select the `chrome-extension` folder

6. The Trap Eye icon will appear in your toolbar

## Usage

### Automatic Protection
- The extension automatically analyzes URLs as you browse
- High-risk sites will trigger visual warnings and notifications
- All analysis happens in real-time with minimal performance impact

### Manual Analysis
1. Click the Trap Eye icon in your toolbar
2. The popup will automatically analyze the current page
3. You can also enter any URL to analyze in the "Analyze Custom URL" field
4. View detailed risk assessment with feature breakdown

### Settings
1. Right-click the Trap Eye icon and select "Options"
2. Or click the gear icon in the popup
3. Configure:
   - Real-time analysis toggle
   - Risk threshold (default: 70%)
   - Notification preferences
   - API server URL (default: http://localhost:8000)
   - History tracking options

## Troubleshooting

### Extension Not Working
1. Check if the backend is running:
   ```bash
   python test_chrome_extension_backend.py
   ```

2. Check the Chrome console for errors:
   - Right-click on any page
   - Select "Inspect"
   - Go to the "Console" tab

3. Reload the extension:
   - Go to `chrome://extensions/`
   - Click the reload icon on the Trap Eye extension

### Common Issues

1. **"Address already in use" error**: 
   - Kill the process using port 8000:
     ```bash
     netstat -ano | findstr :8000
     taskkill /PID <process_id> /F
     ```

2. **Connection errors in popup**:
   - Verify the backend is running on port 8000
   - Check Windows Firewall settings
   - Try accessing http://localhost:8000/health in your browser
   - Use the "Test Connection" button in extension settings

3. **No warnings appearing**:
   - Check that "Real-time Analysis" is enabled in settings
   - Verify "Page Warnings" and "Notifications" are enabled
   - Try manually analyzing the page through the popup

## Privacy

- Only URLs are sent to your local analysis server
- No personal browsing data is collected or transmitted
- All analysis happens locally on your machine
- History tracking is optional and stored locally