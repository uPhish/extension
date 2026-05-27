<script>
  import uphishLogo from '../../assets/uphish.png';

  const params = new URLSearchParams(location.search);
  const domain = params.get('domain') || 'this site';
  const originalUrl = params.get('url') || '#';
  const reportedBy = params.get('reported_by') || '';

  let dontBlockAgain = false;
  let detailsVisible = false;

  function goBack() { history.back(); }

  function showDetails() { detailsVisible = true; }

  async function continueToSite() {
    const original = params.get('url');
    if (!original) return;

    if (dontBlockAgain) {
      await browser.runtime.sendMessage({ type: 'ALLOWLIST_DOMAIN', domain: original });
    } else {
      await browser.runtime.sendMessage({ type: 'TEMP_ALLOW_DOMAIN', domain: original });
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
    <h1 class="deceptive">Deceptive site ahead</h1>

    <p class="blocked-line">
      Website blocked: <strong class="domain">{originalUrl}</strong>
    </p>
    <p class="blocked-desc">
      uPhish blocked this page because it may trick you into doing something dangerous like installing software or revealing personal information like passwords or credit cards.
    </p>

    <div class="actions">
      <button class="btn btn-back" on:click={goBack}>Go Back</button>
      {#if !detailsVisible}
        <button class="btn btn-details" on:click={showDetails}>See details</button>
      {/if}
    </div>

    {#if detailsVisible}
      <div class="details-box">
        {#if reportedBy}
          <p class="reported-by">Flagged by: <strong>{reportedBy}</strong></p>
        {/if}
        <p class="info">
          <strong class="domain">{domain}</strong> 
          has been reported as a deceptive site. You can ignore the risk and <a class="continue-link" href={originalUrl} on:click|preventDefault={continueToSite}>go to this unsafe site</a>. 
          Learn more about deceptive sites and phishing at 
          <a href="https://www.antiphishing.org" target="_blank" rel="noopener noreferrer">www.antiphishing.org</a>.
        </p>

        <label class="checkbox-label">
          <input type="checkbox" bind:checked={dontBlockAgain} />
          Do not block this site again.
        </label>
      </div>
    {/if}
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
  .deceptive { color: #05544E; }
  .reported-by { font-size: 0.95rem; color: #05544E; margin-bottom: 8px; }
  .info { font-size: 1.05rem; margin-bottom: 12px; }

  .actions { display: flex; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
  .btn {
    border-radius: 8px; font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.04em; padding: 10px 20px; cursor: pointer;
    border: none; text-transform: uppercase; transition: opacity 0.15s;
    font-family: inherit;
  }
  .btn:hover { opacity: 0.88; }
  .btn-back { background: #05544E; color: #fff; }

  .checkbox-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.9rem; color: #555; cursor: pointer;
  }
  .details-box { background: #fff; border: 1px solid #e8e8e8; padding: 18px; border-radius: 8px; margin-top: 12px; }
</style>
