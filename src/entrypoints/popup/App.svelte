<script>
  import uphishLogo from '../../assets/uphish.png';
  import { onMount } from 'svelte';

  let settings = { blockingEnabled: true, passwordBannerEnabled: true };
  let allowlist = [];
  let newUrl = '';
  let activeTab = 'features';

  onMount(async () => {
    const data = await browser.storage.local.get(['settings', 'allowlist']);
    if (data.settings) settings = { ...settings, ...data.settings };
    allowlist = data.allowlist ?? [];
  });

  async function saveSetting(key, value) {
    settings[key] = value;
    await browser.storage.local.set({ settings });
  }

  async function removeFromAllowlist(url) {
    allowlist = allowlist.filter(d => d !== url);
    await browser.storage.local.set({ allowlist });
  }

  async function addToAllowlist() {
    let input = newUrl.trim();
    if (!input) return;
    try {
      new URL(input);
    } catch {
      try {
        input = 'https://' + input;
        new URL(input);
      } catch {
        return;
      }
    }
    const normalized = (new URL(input)).href;
    if (allowlist.includes(normalized)) return;
    allowlist = [...allowlist, normalized];
    await browser.storage.local.set({ allowlist });
    newUrl = '';
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') addToAllowlist();
  }

  let reportState = 'idle';

  async function reportCurrentSite() {
    reportState = 'sending';
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tab?.url) { reportState = 'error'; return; }
      const url = new URL(tab.url);
      const domain = url.hostname.replace(/^www\./, '');
      const params = new URLSearchParams({
        url: tab.url,
        useragent: navigator.userAgent,
      });
      const res = await fetch(`https://api.uphish.com/threatdb/report?${params}`, { method: 'POST' });
      reportState = res.ok ? 'done' : 'error';
    } catch {
      reportState = 'error';
    }
    setTimeout(() => reportState = 'idle', 2500);
  }
</script>

<div class="popup">
  <header class="banner">
    <img src={uphishLogo} alt="uPhish" class="logo" />
    <span class="brand">uPhish</span>
    <button
      class="report-btn"
      class:sending={reportState === 'sending'}
      class:done={reportState === 'done'}
      class:error={reportState === 'error'}
      on:click={reportCurrentSite}
      disabled={reportState === 'sending'}
      title="Report current site"
    >
      {#if reportState === 'idle'}Report Site
      {:else if reportState === 'sending'}Sending…
      {:else if reportState === 'done'}Reported
      {:else}Failed
      {/if}
    </button>
  </header>

  <nav class="tabs">
    <button class="tab" class:active={activeTab === 'features'} on:click={() => activeTab = 'features'}>
      Features
    </button>
    <button class="tab" class:active={activeTab === 'allowlist'} on:click={() => activeTab = 'allowlist'}>
      Allow List
    </button>
  </nav>

  {#if activeTab === 'features'}
    <div class="section">
      <div class="row">
        <div class="row-text">
          <span class="row-label">Domain Blocking</span>
          <span class="row-desc">Block known malicious domains</span>
        </div>
        <label class="toggle">
          <input type="checkbox" checked={settings.blockingEnabled}
            on:change={e => saveSetting('blockingEnabled', e.target.checked)} />
          <span class="slider"></span>
        </label>
      </div>

      <div class="row">
        <div class="row-text">
          <span class="row-label">Password Warning Banner</span>
          <span class="row-desc">Warn when typing a password</span>
        </div>
        <label class="toggle">
          <input type="checkbox" checked={settings.passwordBannerEnabled}
            on:change={e => saveSetting('passwordBannerEnabled', e.target.checked)} />
          <span class="slider"></span>
        </label>
      </div>
    </div>
  {/if}

  {#if activeTab === 'allowlist'}
    <div class="section">
      <div class="add-row">
          <input
          class="domain-input"
          type="text"
          placeholder="https://example.com/page"
          bind:value={newUrl}
          on:keydown={handleKeydown}
        />
      </div>

      {#if allowlist.length === 0}
        <p class="empty">No domains allowed yet.</p>
      {:else}
        <ul class="list">
          {#each allowlist as url}
            <li class="list-item">
              <span class="list-domain">{url}</span>
              <button class="remove-btn" on:click={() => removeFromAllowlist(url)} aria-label="Remove">✕</button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { font-family: 'Poppins', system-ui, sans-serif; background: #fff; }

  .popup { width: 320px; display: flex; flex-direction: column; }

  .banner {
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
  }
  .logo { width: 28px; height: 28px; border-radius: 6px; object-fit: contain; }
  .brand { color: #05544E; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.02em; flex: 1; }

  .tabs {
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    background: #fff;
  }
  .tab {
    flex: 1;
    padding: 10px 0;
    background: none;
    border: none;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 500;
    color: #888;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }
  .tab.active { color: #05544E; border-bottom-color: #05544E; font-weight: 600; }
  .tab:hover:not(.active) { color: #444; }

  .section { padding: 12px 16px 16px; display: flex; flex-direction: column; gap: 4px; }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .row:last-child { border-bottom: none; }
  .row-text { display: flex; flex-direction: column; gap: 2px; }
  .row-label { font-size: 0.875rem; font-weight: 600; color: #111; }
  .row-desc { font-size: 0.75rem; color: #888; }

  .toggle { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; inset: 0;
    background: #ccc; border-radius: 22px; cursor: pointer;
    transition: background 0.2s;
  }
  .slider::before {
    content: '';
    position: absolute;
    width: 16px; height: 16px;
    left: 3px; top: 3px;
    background: #fff; border-radius: 50%;
    transition: transform 0.2s;
  }
  .toggle input:checked + .slider { background: #05544E; }
  .toggle input:checked + .slider::before { transform: translateX(18px); }

  .add-row { display: flex; gap: 8px; margin-bottom: 12px; }
  .domain-input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 7px 10px;
    font-family: inherit;
    font-size: 0.82rem;
    outline: none;
    transition: border-color 0.15s;
  }
  .domain-input:focus { border-color: #05544E; }

  .empty { font-size: 0.82rem; color: #aaa; text-align: center; padding: 12px 0; }

  .list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
  .list-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 10px;
    background: #f6fffe;
    border: 1px solid #d4edea;
    border-radius: 6px;
  }
  .list-domain { font-size: 0.82rem; color: #05544E; font-weight: 500; }
  .remove-btn {
    background: none; border: none; cursor: pointer;
    color: #bbb; font-size: 0.75rem; padding: 2px 4px;
    border-radius: 4px; line-height: 1;
  }
  .remove-btn:hover { background: #fee; color: #c62828; }

  .report-btn {
    margin-left: auto;
    flex-shrink: 0;
    background: transparent;
    color: #05544E;
    border: 1.5px solid #05544E;
    border-radius: 6px;
    padding: 5px 12px;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .report-btn:hover:not(:disabled) {
    background: #05544E;
    color: #fff;
  }
  .report-btn:disabled { opacity: 0.6; cursor: default; }
  .report-btn.done {
    background: #e6f7f0;
    color: #1a7a50;
    border-color: #1a7a50;
  }
  .report-btn.error {
    background: #fdf0f0;
    color: #c62828;
    border-color: #c62828;
  }
</style>
