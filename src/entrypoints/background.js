const threatCache = {};
const CACHE_TTL_MS = 5 * 60 * 1000; 

async function isThreat(fullUrl) {
  const cached = threatCache[fullUrl];
  if (cached && Date.now() < cached.expiresAt) return { blocked: cached.blocked, reportedBy: cached.reportedBy };

  try {
    const urlWithParam = `https://api.uphish.com/threatdb/check?url=${encodeURIComponent(fullUrl)}`;
    const res = await fetch(urlWithParam, { method: 'POST' });
    if (!res.ok) return { blocked: false, reportedBy: null };
    let data;
    try {
      data = await res.json();
    } catch {
      return { blocked: false, reportedBy: null };
    }
    const blocked = !!data.is_blocked;
    const reportedBy = typeof data.reported_by === 'string' ? data.reported_by : null;
    threatCache[fullUrl] = { blocked, reportedBy, expiresAt: Date.now() + CACHE_TTL_MS };
    return { blocked, reportedBy };
  } catch {
    return { blocked: false, reportedBy: null };
  }
}

export default defineBackground(() => {
  browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return;

    try {
      const url = new URL(details.url);
      if (!url.protocol.startsWith('http')) return;
      const hostname = url.hostname.replace(/^www\./, '');
      const fullUrl = details.url;

      const { allowlist = [], tempAllowed = {}, settings = {} } = await browser.storage.local.get(['allowlist', 'tempAllowed', 'settings']);

      if (settings.blockingEnabled === false) return;
      if (allowlist.includes(fullUrl)) return;
      if (tempAllowed[fullUrl] && Date.now() < tempAllowed[fullUrl]) return;

      const result = await isThreat(fullUrl);
      if (!result.blocked) return;

      const reportedParam = result.reportedBy ? `&reported_by=${encodeURIComponent(result.reportedBy)}` : '';
      const blockPage = browser.runtime.getURL(
        `/block.html?domain=${encodeURIComponent(hostname)}&url=${encodeURIComponent(details.url)}${reportedParam}`
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
