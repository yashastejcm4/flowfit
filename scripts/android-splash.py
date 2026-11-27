"""Make Android's own launch screen match the app's splash: same dark background, same sharp logo, no grey circle.
Runs in CI after `npx cap add android` and `capacitor-assets generate`."""
import re, shutil, pathlib
res = pathlib.Path('android/app/src/main/res')
(res / 'drawable-nodpi').mkdir(parents=True, exist_ok=True)
shutil.copy('assets/splash-icon.png', res / 'drawable-nodpi' / 'splash_icon.png')
colors = res / 'values' / 'colors.xml'
c = colors.read_text() if colors.exists() else '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n'
if 'flowfit_bg' not in c:
    c = c.replace('</resources>', '    <color name="flowfit_bg">#0E0E0E</color>\n</resources>')
colors.write_text(c)
styles = res / 'values' / 'styles.xml'
s = styles.read_text()
items = {
    'windowSplashScreenBackground': '@color/flowfit_bg',
    'windowSplashScreenAnimatedIcon': '@drawable/splash_icon',
    'windowSplashScreenIconBackgroundColor': '@color/flowfit_bg',
    'android:windowBackground': '@color/flowfit_bg',
}
m = re.search(r'(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)(.*?)(</style>)', s, re.S)
assert m, 'launch theme not found'
body = m.group(2)
for k, v in items.items():
    body = re.sub(r'\s*<item name="%s">[^<]*</item>' % re.escape(k), '', body)
    body += '\n        <item name="%s">%s</item>' % (k, v)
s = s[:m.start()] + m.group(1) + body + '\n    ' + m.group(3) + s[m.end():]
styles.write_text(s)
print(s)
