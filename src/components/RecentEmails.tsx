import { useStore } from '@nanostores/preact';
import { arr, arrEmails, removeRecentEmail } from 'src/store/current-email';

export default function RecentEmails() {
  const $arr = useStore(arr);
  const $arrEmails = useStore(arrEmails);

  if ($arr.length > 0 || $arrEmails.length === 0) return null;

  const sorted = [...$arrEmails].sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));

  return (
    <div class="px-4 py-4">
      <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Recientes</p>
      <div class="flex flex-wrap gap-2">
        {sorted.map((item) => (
          <span
            key={item.email}
            class="group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-[#334155]/60 hover:bg-indigo-500/20 border border-[#475569]/50 hover:border-indigo-500/30 cursor-pointer transition-all duration-150"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('recent-email-selected', { detail: item.email })
              );
            }}
          >
            <span class="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors">{item.email}</span>
            <button
              class="p-0.5 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                removeRecentEmail(item.email);
              }}
              title="Eliminar"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
