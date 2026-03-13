# LinkLens for WhatsApp

A Chrome extension that automatically detects and analyzes links in WhatsApp Web chats for security risks.

## Features

- Automatically scans all links in WhatsApp Web chats
- Sends links to your FastAPI backend for analysis
- Displays color-coded credibility scores next to each link:
  - Green = Safe
  - Red = Risky
- Shows a floating panel with all analyzed links
- Caches results to avoid repeated API calls
- Works in real-time as you browse WhatsApp Web

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `linklens-whatsapp` directory
5. The extension should now appear in your Chrome toolbar

## Backend Setup

Make sure your FastAPI backend is running on `http://127.0.0.1:8002/` with the `/predict` endpoint available.

The endpoint should accept POST requests with JSON body:
```json
{
  "url": "https://example.com"
}
```

And return a response with a score:
```json
{
  "label": "safe",
  "score": 0.0
}
```

Where scores less than 0.5 are considered safe, and scores 0.5 or higher are considered risky.

## Usage

1. Open WhatsApp Web at https://web.whatsapp.com
2. Open any chat containing links
3. LinkLens will automatically analyze all links in the chat
4. Safe links will be marked with a green indicator
5. Risky links will be marked with a red indicator
6. Click the LinkLens icon in the floating panel to view all analyzed links

## How It Works

1. The content script monitors WhatsApp Web for new messages
2. When links are detected, they are sent to the background service worker
3. The background service worker sends the URLs to your FastAPI backend
4. Results are cached locally to avoid repeated API calls
5. The content script displays indicators next to each link
6. A floating panel shows all analyzed links with their scores

## Privacy

- Only URLs are sent to your backend for analysis
- No message content or personal data is transmitted
- Results are cached locally in your browser
- All processing happens on your machine

## Troubleshooting

If the extension isn't working:

1. Make sure your FastAPI backend is running on port 8002
2. Check the Chrome extension console for error messages
3. Verify that WhatsApp Web is properly loaded
4. Try refreshing WhatsApp Web
5. Check that the extension has the necessary permissions

## Development

To modify the extension:

1. Make changes to the JavaScript/CSS files
2. Go to `chrome://extensions`
3. Click the refresh icon on the LinkLens extension card
4. Reload WhatsApp Web to see changes