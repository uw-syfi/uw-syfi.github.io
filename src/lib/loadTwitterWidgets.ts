let twitterScriptLoadingPromise: Promise<void> | null = null;

function insertTwitterScript(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve();
  }

  // If the global twttr is already present, no need to insert again
  if ((window as any).twttr && (window as any).twttr.widgets) {
    return Promise.resolve();
  }

  // Avoid duplicate script insertions
  if (twitterScriptLoadingPromise) {
    return twitterScriptLoadingPromise;
  }

  twitterScriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Twitter widgets.js')));
      // If it already loaded before listeners attached, resolve on next tick
      if ((existing as any).readyState === 'complete') {
        resolve();
      }
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.charset = 'utf-8';
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Failed to load Twitter widgets.js')));
    document.body.appendChild(script);
  });

  return twitterScriptLoadingPromise;
}

function waitForTwttrReady(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const twttr = (window as any).twttr;

  // If already initialized and widgets API present, resolve immediately
  if (twttr && twttr.widgets && typeof twttr.widgets.load === 'function') {
    return Promise.resolve();
  }

  // If ready() API exists, use it for robust readiness
  if (twttr && typeof twttr.ready === 'function') {
    return new Promise<void>((resolve) => {
      twttr.ready(() => resolve());
    });
  }

  // Fallback: poll briefly until widgets API appears (handles rare race conditions)
  return new Promise<void>((resolve) => {
    const start = Date.now();
    const interval = window.setInterval(() => {
      const t = (window as any).twttr;
      if (t && t.widgets && typeof t.widgets.load === 'function') {
        window.clearInterval(interval);
        resolve();
      } else if (Date.now() - start > 3000) {
        // Give up after 3s; we'll attempt load anyway
        window.clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

export async function loadAndHydrateTwitterWidgets(root?: HTMLElement | null): Promise<void> {
  try {
    await insertTwitterScript();
    await waitForTwttrReady();
    const twttr = (window as any).twttr;
    if (twttr && twttr.widgets && typeof twttr.widgets.load === 'function') {
      twttr.widgets.load(root || undefined);
    }
  } catch {
    // Silently ignore failures to avoid breaking the page
  }
}


