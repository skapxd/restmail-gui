import { useStore } from '@nanostores/preact';
import { useRef, useEffect } from 'preact/hooks';
import { currentEmail, setMobileView, pendingMobileNav } from '../store/current-email';

const SHADOW_STYLES = `
  :host {
    display: block;
    background-color: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    color-scheme: light;
  }
  @media (min-width: 768px) {
    :host {
      padding: 24px;
    }
  }
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  body, html {
    margin: 0;
    padding: 0;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.6;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #0f172a;
    margin-top: 0;
  }
  p, li, td, span, div {
    color: #334155;
  }
  a {
    color: #4f46e5;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  table {
    max-width: 100%;
  }
`;

function ShadowContent({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    if (!shadowRef.current) {
      shadowRef.current = hostRef.current.attachShadow({ mode: 'open' });
    }
    shadowRef.current.innerHTML = `<style>${SHADOW_STYLES}</style>${html}`;
  }, [html]);

  return <div ref={hostRef} />;
}

export default function Viewer() {
  const $currentEmail = useStore(currentEmail);
  const $pendingNav = useStore(pendingMobileNav);
  const hasEmail = $currentEmail?.from?.length > 0 && $currentEmail?.from?.[0]?.address;

  useEffect(() => {
    if ($pendingNav) {
      setMobileView('viewer');
      pendingMobileNav.set(false);
    }
  }, [$pendingNav]);

  if (!hasEmail) {
    return (
      <section class="flex-1 flex flex-col items-center justify-center bg-[#0f172a] px-8">
        <div class="w-20 h-20 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-6">
          <svg class="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-slate-300 mb-2">No email selected</h2>
        <p class="text-sm text-slate-500 text-center max-w-xs">
          Enter a username in the search bar to load their restmail.net inbox
        </p>
      </section>
    );
  }

  const senderName = $currentEmail.from[0].name || $currentEmail.from[0].address;
  const senderAddress = $currentEmail.from[0].address;
  const initial = senderName ? senderName[0].toUpperCase() : '?';

  return (
    <section class="flex-1 flex flex-col bg-[#0f172a] h-full overflow-hidden">
      {/* Back button - mobile only */}
      <button
        onClick={() => setMobileView('list')}
        class="md:hidden flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-white border-b border-[#334155] bg-[#1e293b]/80 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to inbox
      </button>

      {/* Email header */}
      <div class="px-4 md:px-6 py-5 border-b border-[#334155] bg-[#1e293b]/50">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-semibold text-sm flex-shrink-0">
            {initial}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="text-base font-semibold text-white truncate">{senderName}</h3>
              {$currentEmail.date && (
                <time class="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
                  {new Date($currentEmail.date).toLocaleDateString('es', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              )}
            </div>
            <p class="text-xs text-slate-400 mt-0.5 truncate">{senderAddress}</p>
            <h4 class="text-sm text-slate-200 mt-2 font-medium">{$currentEmail.subject}</h4>
            {$currentEmail.to?.[0]?.address && (
              <p class="text-xs text-slate-500 mt-1">
                To: <span class="text-slate-400">{$currentEmail.to[0].address}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Email body - isolated via Shadow DOM */}
      <div class="flex-1 overflow-y-auto p-4 md:p-6">
        <ShadowContent html={$currentEmail.html} />
      </div>
    </section>
  );
}
