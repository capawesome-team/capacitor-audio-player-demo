# Capacitor Audio Player Plugin Demo App

⚡️ Simple vanilla JS + Capacitor app to demonstrate the use of the [Capacitor Audio Player plugin](https://capawesome.io/docs/sdks/capacitor/audio-player/), built as **Music Player Lab**: a minimal music player with a playlist, seek bar, volume, playback speed, loop, and native lock-screen controls.

📖 Read the accompanying blog post: [Audio Player 8.4.0: Playlists and Media Session Support](https://capawesome.io/blog/capacitor-audio-player-8-4-0-release/).

## Plugins

The following plugins are included:

- [capawesome-team/capacitor-audio-player](https://capawesome.io/docs/sdks/capacitor/audio-player/)

## Music

The playlist uses 3 tracks, played from local web assets. See [`public/assets/audio/README.md`](public/assets/audio/README.md) for more information.

## Development 💻

### Prerequisites

- Install [Node.js](https://nodejs.org) which includes Node Package Manager
- Android development: Install [Android Studio](https://developer.android.com/studio)
- iOS development: Install [Xcode](https://apps.apple.com/de/app/xcode/id497799835?mt=12)
- A [Capawesome Insiders](https://capawesome.io/insiders/) license key, since the Audio Player plugin is published to the Capawesome npm registry

### Getting Started

```bash
# Clone this repository
$ git clone https://github.com/capawesome-team/capacitor-audio-player-demo.git

# Change to the root directory of the project
$ cd capacitor-audio-player-demo

# Install all dependencies
$ npm i

# Run the web app
$ npm run dev

# Build the web app
$ npm run build

# Run the Android app
$ npx cap sync android
$ npx cap run android

# Run the iOS app
$ npx cap sync ios
$ npx cap run ios
```

This project uses plain [Vite](https://vite.dev/) and vanilla JavaScript, without any UI framework.

## Demo

https://github.com/user-attachments/assets/7b872ee5-f3d9-493d-82b4-bd3a407ebf8b



## About Capawesome

Capawesome builds professional, production-ready plugins and tools for mobile developers. Our mission is to make modern mobile app development easier, faster, and more reliable — without workarounds or hacks.

Learn more at 👉 [https://capawesome.io](https://capawesome.io)
