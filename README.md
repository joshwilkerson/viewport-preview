# Viewport Preview

A simple, local HTML tool for previewing websites in mobile-sized popup windows.

## Why?

Browser DevTools can simulate mobile viewports, but this tool offers a cleaner workflow:

- **Screenshot-ready** - Opens a real browser window at exact device dimensions, perfect for capturing clean screenshots
- **No DevTools clutter** - Just the site, nothing else
- **Easy device switching** - One-click presets for common phones and tablets
- **Quick & easy** - A straightforward HTML file with no dependencies to install

## Usage

1. Open `index.html` in your browser
2. Enter a URL
3. Select a device preset or enter custom dimensions
4. Click "Open window"

A popup window opens at the specified size – screenshot or inspect with the tools you're already using.

## Device Presets

Includes common viewport sizes for:

- **Phones** - iPhone SE, iPhone 14, Pixel 7, etc.
- **Tablets** - iPad Mini, iPad Pro, etc.

Or enter any custom width/height (minimum 200px).

## Getting Started

Just HTML and JS - no server, no build step, and no dependencies to install.

1. Download or clone this repo
2. Open `index.html` in your browser
3. That's it 🎉

## Tech Specs

- The app is a single `index.html` file that loads Tailwind and Lucide from CDNs - no build step required.
- JavaScript is split into two files: `devices.js` contains the device preset data, and `app.js` handles the UI logic.
- Popups are opened using `window.open()` with specified dimensions.
- **localStorage** is used to persist your color mode preference and recent URL history between sessions.
- The settings menu uses the native **Popover API** with **CSS Anchor Positioning** for positioning. These are modern browser features with growing support - if the menu appears mispositioned, your browser may not fully support anchor positioning. (🔗 [browser compatibility](https://caniuse.com/css-anchor-positioning))

- Made possible by:
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework (via CDN)
  - [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
  - [Claude Code](https://claude.ai/code) - The robot that did some of the typing
  - My relentless need to reinvent the wheel

> [!NOTE]
> Popup blockers may prevent the preview window from opening. If nothing happens when you click "Open", check your browser's popup settings for this page.
