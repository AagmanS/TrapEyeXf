# Installation Guide

## Loading the Extension in Chrome

1. Open Google Chrome browser
2. Navigate to `chrome://extensions` in the address bar
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click the "Load unpacked" button
5. Navigate to and select the `chrome-extension` folder
6. The "AI Phishing Detector" extension should now appear in your list of extensions

## Verifying Installation

After installation, you should see:
- A shield icon in your Chrome toolbar
- The extension listed on `chrome://extensions` page
- Extension name: "AI Phishing Detector"
- Version: 1.0.0

## Using the Extension

1. Click the shield icon in your toolbar to open the popup
2. The popup will show the current page URL and analysis options
3. Click "Analyze Current Page" to check the current website
4. Or enter a custom URL and click "Analyze Custom URL"
5. High-risk websites will trigger visual warnings and notifications

## Configuring Settings

1. Right-click the extension icon and select "Options"
2. Or click the three dots next to the extension and select "Options"
3. Adjust settings like:
   - Enable/disable real-time analysis
   - Set risk threshold
   - Configure API server URL

## Troubleshooting

### Extension not loading
- Ensure all files are present in the `chrome-extension` folder
- Check that `manifest.json` is properly formatted
- Make sure you selected the correct folder when loading

### API Connection Issues
- Ensure the backend server is running on `http://localhost:8000`
- Check the API URL in extension options
- Verify network connectivity

### Missing Permissions
- If prompted, grant all requested permissions
- Permissions are needed for URL analysis and notifications