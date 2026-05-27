import uphishLogo from '../assets/uphish.png';

const DURATION_MS = 10_000;

export function showDomainCheckBanner(inputEl) {
  const hostname = location.hostname;
  const parts = hostname.split('.');
  const registeredDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
  const logoUrl = uphishLogo;

  const rect = inputEl.getBoundingClientRect();
  const width = Math.max(rect.width, 300);
  const rawLeft = rect.left + rect.width / 2 - width / 2;
  const left = Math.max(8, Math.min(rawLeft, window.innerWidth - width - 8));

  const host = document.createElement('div');
  Object.assign(host.style, {
    position: 'fixed',
    top: `${rect.bottom}px`,
    left: `${left}px`,
    width: `${width}px`,
    zIndex: '2147483647',
  });

  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .banner {
      background: #f6fffe;
      border-radius: 0 0 6px 6px;
      display: flex;
      align-items: center;
      padding: 10px 10px 10px 14px;
      gap: 10px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 16px;
      color: #1a1a1a;
      box-shadow: 0 4px 14px rgba(0,0,0,0.13);
      overflow: hidden;
      position: relative;
    }
    .text {
      flex: 1;
      line-height: 1.35;
    }

    .domain {
      font-weight: 700;
      font-size: 17px;
      color: #05544E;
    }

    .close {
      flex-shrink: 0;
      width: 26px;
      height: 26px;
      border: none;
      background: none;
      cursor: pointer;
      color: #888;
      font-size: 18px;
      line-height: 1;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .close:hover { background: rgba(0,0,0,0.07); color: #333; }

    .left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .logo {
      width: 24px;
      height: 24px;
      object-fit: contain;
      border-radius: 4px;
    }

    .progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 0;
      background: #05544E;
      animation: fill ${DURATION_MS}ms linear forwards;
    }

    @keyframes fill {
      from { width: 0% }
      to   { width: 100% }
    }

    .banner.dismiss {
      animation: fadeOut 0.25s ease forwards;
    }

    @keyframes fadeOut {
      to { opacity: 0; transform: translateY(4px); }
    }
  `;

  const banner = document.createElement('div');
  banner.className = 'banner';

  const text = document.createElement('div');
  text.className = 'text';

  const desc = document.createElement('div');
  desc.appendChild(document.createTextNode('You are on '));
  const domainSpan = document.createElement('span');
  domainSpan.className = 'domain';
  domainSpan.textContent = registeredDomain;
  desc.appendChild(domainSpan);
  desc.appendChild(document.createTextNode(' — confirm this is the site you intended to put your password.'));

  text.appendChild(desc);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Dismiss');

  const leftSlot = document.createElement('div');
  leftSlot.className = 'left';

  const logo = document.createElement('img');
  logo.className = 'logo';
  logo.src = logoUrl;
  logo.alt = 'Uphish logo';

  const progress = document.createElement('div');
  progress.className = 'progress';

  leftSlot.appendChild(logo);

  banner.appendChild(leftSlot);
  banner.appendChild(text);
  banner.appendChild(closeBtn);
  banner.appendChild(progress);
  shadow.appendChild(style);
  shadow.appendChild(banner);
  document.documentElement.appendChild(host);

  function dismiss() {
    banner.classList.add('dismiss');
    banner.addEventListener('animationend', () => host.remove(), { once: true });
  }

  closeBtn.addEventListener('click', dismiss);
  progress.addEventListener('animationend', dismiss);
}
