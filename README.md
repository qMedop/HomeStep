# HomeStep — Custom Start Dashboard

A clean, lightweight, glassmorphism-inspired custom browser start page built with:

* HTML
* CSS
* Vanilla JavaScript
* LocalStorage
* Free APIs

---

# Features

* Search engine switching
* Weather widget
* Live clock
* Custom shortcuts
* Website search shortcuts
* Dynamic favicons
* Glassmorphism UI
* Wallpapers
* Local storage settings
* Lightweight and offline-friendly

---

# Project Structure

```txt
Browser_first_page/
│
├── index.html
├── style.css
├── script.js
├── manifest.json
│
├── assets/
│   ├── icons/
│   ├── images/
│   ├── fonts/
```

---

# Extension Setup (Chromium Browsers)

Create a file named:

```
manifest.json
```

Place it directly in the root folder beside:

* index.html
* style.css
* script.js

Use this exact configuration:

```
{
  "manifest_version": 3,
  "name": "HomeStep - Custom Start Dashboard",
  "version": "1.0",
  "description": "A clean, glassmorphism personalized start page.",
  "chrome_url_overrides": {
    "newtab": "index.html"
  }
}
```

---

# Set Up as Your Default New Tab Page

Modern browsers restrict loading raw local HTML files directly as the default new tab page.

The cleanest solution is turning the project into a local browser extension.

---

# Google Chrome

1. Open:

```txt
chrome://extensions/
```

2. Enable:

```txt
Developer mode
```

3. Click:

```txt
Load unpacked
```

4. Select your project folder:

```txt
Browser_first_page
```

5. Open a new tab.

6. When Chrome asks:

```txt
Is this the new tab page you expected?
```

Click:

```txt
Keep it
```

---

# Brave Browser

1. Open:

```txt
brave://extensions/
```

2. Enable:

```txt
Developer mode
```

3. Click:

```txt
Load unpacked
```

4. Select:

```txt
Browser_first_page
```

5. Open a new tab.

6. Confirm the new tab override.

---

# Microsoft Edge

1. Open:

```txt
edge://extensions/
```

2. Enable:

```txt
Developer mode
```

3. Click:

```txt
Load unpacked
```

4. Select:

```txt
Browser_first_page
```

5. Open a new tab.

6. Click:

```txt
Keep changes
```

---

# Mozilla Firefox

Firefox handles new tab overrides differently.

Recommended extension:

urlNew Tab Override (Firefox Add-on)[https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

## Setup

1. Install the extension.

2. Open:

```txt
about:addons
```

3. Open the extension settings.

4. Change:

```txt
Option Type → Local File
```

5. Browse and select:

```txt
index.html
```

6. Grant file permissions if requested.

7. Open a new tab.

---

# Weather API

This project uses:

urlOpen-Meteo API[https://open-meteo.com/](https://open-meteo.com/)

Features:

* Free
* No API key required
* Geolocation support
* Current weather
* Forecast support

---

# Shortcut Icons

Website icons are dynamically loaded using:

```txt
https://www.google.com/s2/favicons?domain=example.com&sz=128
```

If a website does not provide a favicon:

* The shortcut automatically falls back to the first letter of the website title.

---

# Changing the Background Wallpaper

1. Add your image into:

```txt
assets/images/
```

Example:

```txt
forest.png
```

2. Rename it to bg.png
   
```txt
bg.png
```

3. Save:

---

# Keyboard Shortcuts

```txt
/
```

Focus search input.

```txt
Esc
```
`

Open command palette.

---

# Future Ideas

* Drag & drop widgets
* Notes widget
* Spotify integration
* Search suggestions
* Wallpaper gallery
* Sync settings
* Animated backgrounds
* Dock-style shortcuts
* Calendar integration

---

# Credits

Weather Data:

urlOpen-Meteo[https://open-meteo.com/](https://open-meteo.com/)

Favicon Service:

urlGoogle Favicon Service[https://www.google.com/s2/favicons](https://www.google.com/s2/favicons)
