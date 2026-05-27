const threatCache = {};
const CACHE_TTL_MS = 5 * 60 * 1000; 

async function isThreat(hostname) {
  const cached = threatCache[hostname];
  if (cached && Date.now() < cached.expiresAt) return cached.blocked;

  try {
    const res = await fetch(`https://api.uphish.com/threatdb/check/${encodeURIComponent(hostname)}`);
    const text = (await res.text()).trim();
    const blocked = text.toLowerCase() === 'true';
    threatCache[hostname] = { blocked, expiresAt: Date.now() + CACHE_TTL_MS };
    return blocked;
  } catch {
    return false;
  }
}

export default defineBackground(() => {
  browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return;

    try {
      const url = new URL(details.url);
      if (!url.protocol.startsWith('http')) return;
      const hostname = url.hostname.replace(/^www\./, '');

      const { allowlist = [], tempAllowed = {}, settings = {} } = await browser.storage.local.get(['allowlist', 'tempAllowed', 'settings']);

      if (settings.blockingEnabled === false) return;
      if (allowlist.includes(hostname)) return;
      if (tempAllowed[hostname] && Date.now() < tempAllowed[hostname]) return;

      const blocked = await isThreat(hostname);
      if (!blocked) return;

      const blockPage = browser.runtime.getURL(
        `/block.html?domain=${encodeURIComponent(hostname)}&url=${encodeURIComponent(details.url)}`
      );
      await browser.tabs.update(details.tabId, { url: blockPage });
    } catch (_) {}
  });

  browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
      if (msg.type === 'ALLOWLIST_DOMAIN') {
        const { allowlist = [] } = await browser.storage.local.get('allowlist');
        if (!allowlist.includes(msg.domain)) {
          await browser.storage.local.set({ allowlist: [...allowlist, msg.domain] });
        }
      } else if (msg.type === 'TEMP_ALLOW_DOMAIN') {
        const { tempAllowed = {} } = await browser.storage.local.get('tempAllowed');
        tempAllowed[msg.domain] = Date.now() + 30 * 60 * 1000;
        await browser.storage.local.set({ tempAllowed });
      }
      sendResponse({ ok: true });
    })();
    return true;
  });
});
