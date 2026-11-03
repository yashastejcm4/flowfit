# Flowfit — Android app

Your workout tracker as a real Android app (built with Capacitor).
Everything lives in `www/` — the same app you've been testing, plus `native-bridge.js` for Android features.

## What the Android version adds
- Installs as an app with the Flowfit icon and splash screen (from your F logo)
- **Back button / back gesture:** closes the open panel → goes to Home → leaves the app
- **Native vibration** on taps, ticks and saves
- **Rest timer notification:** "Rest over" pops up even with the phone locked
- **Status bar** matches the app colours
- **Data saved to device storage** as a second copy, so it survives a cleared web cache
- **Groq key** kept in the app's private storage (only this app can read it)
- Groq Coach, exercise pictures and GIFs work here (the web preview blocks them)

## Option A — Get the APK without installing anything (GitHub, free)
1. Create a free account at github.com, then click **New repository** → name it `flowfit` → **Private** → Create.
2. On the empty repo page click **uploading an existing file**, drag in **everything in this folder**
   (including the hidden `.github` folder — on Windows/Mac drag the folder contents, or use GitHub Desktop).
3. Click **Commit changes**. Open the **Actions** tab: a "Build Android APK" run starts (about 6–8 minutes).
4. When it shows a green tick, open the run → **Artifacts** → download **flowfit-apk** (a .zip with `app-debug.apk`).
5. Send `app-debug.apk` to your phone, tap it, allow "Install unknown apps" for your file manager once, and install.

Every time you upload a new version of `www/`, GitHub builds a fresh APK.

## Option B — Build on your computer (Android Studio)
Needs: Node.js 20+ and Android Studio (with Android SDK and JDK 21, both come with it).
```
npm install
npx cap add android
npx capacitor-assets generate --android
npx cap sync android
npx cap open android      # Android Studio opens → Build ▸ Build APK(s), or press Run with your phone plugged in
```
After changing anything in `www/`, run `npx cap sync android` again.

## Notes
- This is a **debug** build, fine for your own phone. For the Play Store you'd create a signed release build later.
- First time the rest timer runs, Android asks to allow notifications — tap Allow.
- On some phones with strict battery saving, the "Rest over" notification can arrive a few seconds late when locked.
