/* Flowfit — Android bridge (Capacitor). Does nothing in a normal browser. */
(async () => {
  const Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;
  const P = Cap.Plugins || {};
  const { App, Haptics, StatusBar, Preferences, LocalNotifications, SplashScreen } = P;
  const KEY = 'ironsplit.v1', GKEY = 'ironsplit.groqkey';
  document.documentElement.classList.add('native');

  /* 1. Device storage: every save is mirrored to app storage, restored if the WebView cache was cleared */
  if (Preferences) {
    try {
      if (window.__fresh) {
        const r = await Preferences.get({ key: KEY });
        if (r && r.value) {
          try { localStorage.setItem(KEY, r.value); } catch (e) {}
          S = JSON.parse(r.value); lastView = null;
          window.__fresh = false;
          if (S.profile && (S.profile.train || S.profile.trainSkip) && ui.sheet === 'setup') closeSheet();
          render();
        }
      }
      if (!getKey()) { const k = await Preferences.get({ key: GKEY }); if (k && k.value) { setKey(k.value); render(); } }
      let t = null;
      window.__onSave = () => { clearTimeout(t); t = setTimeout(() => Preferences.set({ key: KEY, value: JSON.stringify(S) }).catch(() => {}), 400); };
      window.__onKey = v => { (v ? Preferences.set({ key: GKEY, value: v }) : Preferences.remove({ key: GKEY })).catch(() => {}); };
      window.__onSave();
    } catch (e) {}
  }

  /* 2. Native haptics */
  if (Haptics) {
    window.__buzz = p => {
      try {
        if (Array.isArray(p)) return p.length >= 5 ? Haptics.notification({ type: 'SUCCESS' }) : p.length === 3 && p[1] >= 40 && p[0] <= 10 ? Haptics.notification({ type: 'WARNING' }) : Haptics.impact({ style: 'MEDIUM' });
        if (p <= 6) return Haptics.selectionChanged();
        return Haptics.impact({ style: p <= 12 ? 'LIGHT' : p <= 20 ? 'MEDIUM' : 'HEAVY' });
      } catch (e) {}
    };
  }

  /* 3. Back button: close the top layer, then go Home, then leave the app */
  if (App) {
    App.addListener('backButton', () => {
      if (typeof navDepth !== 'undefined' && navDepth > 0) { history.back(); return; }
      if (ui.view !== 'workout') { act.nav({ v: 'workout' }); return; }
      App.minimizeApp();
    });
    App.addListener('resume', () => { try { render(); } catch (e) {} });
  }

  /* 4. Status bar follows the app theme */
  if (StatusBar) {
    const sync = () => {
      const bg = getComputedStyle(document.body).backgroundColor || 'rgb(14,14,14)';
      const m = bg.match(/\d+/g) || [14, 14, 14], light = (+m[0] * 299 + +m[1] * 587 + +m[2] * 114) / 1000 > 140;
      const hex = '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('');
      StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
      StatusBar.setBackgroundColor({ color: hex }).catch(() => {});
      StatusBar.setStyle({ style: light ? 'LIGHT' : 'DARK' }).catch(() => {});
    };
    sync();
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
  }

  /* 5. Rest timer keeps working with the phone locked: a notification fires when rest ends */
  if (LocalNotifications) {
    let asked = false, scheduledFor = 0;
    setInterval(async () => {
      const end = ui.restEnd || 0;
      if (end === scheduledFor) return;
      scheduledFor = end;
      try { await LocalNotifications.cancel({ notifications: [{ id: 1 }] }); } catch (e) {}
      if (end > Date.now() + 1500) {
        try {
          if (!asked) { asked = true; const p = await LocalNotifications.checkPermissions(); if (p.display !== 'granted') await LocalNotifications.requestPermissions(); }
          const ex = S.active && S.active.exercises.find(e => ui.feel && e.id === ui.feel.eid);
          await LocalNotifications.schedule({ notifications: [{ id: 1, title: 'Rest over', body: ex ? `Next set: ${ex.name}` : 'Time for your next set', schedule: { at: new Date(end), allowWhileIdle: true } }] });
        } catch (e) {}
      }
    }, 500);
  }

  if (SplashScreen) { try { SplashScreen.hide(); } catch (e) {} }
})();
