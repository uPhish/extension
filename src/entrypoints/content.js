import { showDomainCheckBanner } from '../lib/banner.js';

export default defineContentScript({
  matches: ['<all_urls>'],
  async main() {
    const { settings = {} } = await browser.storage.local.get('settings');
    if (settings.passwordBannerEnabled === false) return;

    let triggered = false;
    const seen = new WeakSet();

    function attachToField(input) {
      if (seen.has(input)) return;
      seen.add(input);
      input.addEventListener('focus', (e) => {
        if (triggered) return;
        triggered = true;
        showDomainCheckBanner(e.currentTarget);
      }, { once: true });
    }

    function scan() {
      document.querySelectorAll('input[type="password"]').forEach(attachToField);
    }

    scan();
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  },
});

