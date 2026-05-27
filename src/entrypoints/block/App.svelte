<script>
  import uphishLogo from '../../assets/uphish.png';

  const params = new URLSearchParams(location.search);
  const domain = params.get('domain') || 'this site';

  let dontBlockAgain = false;

  function goBack() { history.back(); }

  async function continueToSite() {
    const original = params.get('url');
    if (!original) return;

    if (dontBlockAgain) {
      await browser.runtime.sendMessage({ type: 'ALLOWLIST_DOMAIN', domain });
    } else {
      await browser.runtime.sendMessage({ type: 'TEMP_ALLOW_DOMAIN', domain });
    }

    location.href = original;
  }
</script>

<div class="page">
  <header class="top-banner">
    <img src={uphishLogo} alt="uPhish logo" class="banner-logo" />
    <span class="banner-name">uPhish</span>
  </header>

  <main class="content">
    <h1>Website blocked due to malicious activity</h1>

    <p class="blocked-line">
      Website blocked: <strong class="domain">{domain}</strong>
    </p>
    <p class="blocked-desc">
      uPhish blocked this website because it may contain malicious activity.
    </p>
    <p class="warning">We strongly recommend you do not continue.</p>

    <div class="actions">
      <button class="btn btn-back" on:click={goBack}>Go Back</button>
      <button class="btn btn-continue" on:click={continueToSite}>Continue to Site</button>
    </div>

    <label class="checkbox-label">
      <input type="checkbox" bind:checked={dontBlockAgain} />
      Do not block this site again.
    </label>
  </main>
</div>

<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    background: #fff;
    min-height: 100vh;
  }

  .page { display: flex; flex-direction: column; min-height: 100vh; }

  .top-banner {
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 28px;
  }
  .banner-logo { width: 34px; height: 34px; border-radius: 8px; object-fit: contain; }
  .banner-name { color: #05544E; font-size: 1.25rem; font-weight: 700; letter-spacing: 0.02em; }

  .content { padding: 56px 64px; max-width: 1200px; }
  h1 { font-size: 2rem; color: #111; margin-bottom: 20px; line-height: 1.2; }
  .blocked-line { font-size: 1rem; color: #222; margin-bottom: 6px; }
  .domain { color: #05544E; font-weight: 600; }
  .blocked-desc { font-size: 1rem; color: #444; margin-bottom: 16px; }
  .warning { color: #c62828; font-weight: 600; font-size: 1.05rem; margin-bottom: 28px; }

  .actions { display: flex; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
  .btn {
    border-radius: 8px; font-size: 0.95rem; font-weight: 700;
    letter-spacing: 0.04em; padding: 13px 32px; cursor: pointer;
    border: none; text-transform: uppercase; transition: opacity 0.15s;
    font-family: inherit;
  }
  .btn:hover { opacity: 0.88; }
  .btn-back { background: #05544E; color: #fff; }
  .btn-continue { background: transparent; color: #05544E; border: 2px solid #05544E; }

  .checkbox-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.9rem; color: #555; cursor: pointer;
  }
</style>
