# Outward Build Builder

Interactive character build planner for Outward Definitive Edition.
Optimized for iOS (iPhone/iPad) and desktop.

## iOS Installation (Add to Home Screen)

1. Open the app in Safari
2. Tap the **Share** button (□↑)
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add**

The app will launch fullscreen like a native app (PWA-style).

## iOS Features
- Bottom tab bar with safe-area support (notch/home indicator)
- Touch-optimized tap targets (44px minimum)
- Tap-and-hold or tap for tooltips
- Momentum scrolling throughout
- Web Share API for exporting builds (iOS 15+)
- No pull-to-refresh interference

## Desktop Features
- Three-column layout: Skills | Equipment | Stats
- Hover tooltips with 300ms delay
- Full keyboard navigation

## Run locally
```bash
cd app
npm install
npm run dev
```

## Build
```bash
npm run build   # outputs to app/dist
```

Data sourced from outward.wiki.gg, structured in /data.
