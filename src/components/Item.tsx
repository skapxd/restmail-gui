import { useStore } from '@nanostores/preact';
import { arr, getEmails, setCurrentEmail, pendingMobileNav, currentEmail, type Email } from 'src/store/current-email';
import { useEffect } from 'preact/hooks';

export interface ItemProps extends Email {
  index?: number;
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const avatarColors = [
  'bg-indigo-500/20 text-indigo-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-amber-500/20 text-amber-300',
  'bg-rose-500/20 text-rose-300',
  'bg-cyan-500/20 text-cyan-300',
  'bg-violet-500/20 text-violet-300',
  'bg-orange-500/20 text-orange-300',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function Items({ email }: { email?: string }) {
  const $arr = useStore(arr);

  useEffect(() => {
    if (!email) return;
    getEmails(email);
  }, []);

  if ($arr.length === 0) {
    return (
      <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div class="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
          </svg>
        </div>
        <p class="text-sm text-slate-400 font-medium">No emails yet</p>
        <p class="text-xs text-slate-500 mt-1">Search for a username to load their inbox</p>
      </div>
    );
  }

  return (
    <ul class="py-1">
      {$arr.map((item, index) => (
        <Item {...item} index={index} key={item.messageId || index} />
      ))}
    </ul>
  );
}

export function Item(props: ItemProps) {
  const { date, from, subject, index } = props ?? {};
  const $currentEmail = useStore(currentEmail);
  const isActive = $currentEmail?.messageId === props.messageId;

  const senderName = from?.[0]?.name || from?.[0]?.address || 'Unknown';

  const rtf1 = new Intl.RelativeTimeFormat('es', { style: 'short' });
  // @ts-expect-error: err
  const diff = new Date(date) - new Date();
  // @ts-expect-error: err
  const seconds = parseInt(diff / 1000);
  // @ts-expect-error: err
  const minutes = parseInt(seconds / 60);
  // @ts-expect-error: err
  const hours = parseInt(minutes / 60);
  // @ts-expect-error: err
  const days = parseInt(hours / 24);

  const timeRelative = (() => {
    if (days < 0) return rtf1.format(days, 'days');
    if (hours < 0) return rtf1.format(hours, 'hours');
    if (minutes < 0) return rtf1.format(minutes, 'minutes');
    if (seconds < 0) return rtf1.format(seconds, 'seconds');
    return 'now';
  })();

  useEffect(() => {
    if (index === 0) {
      setCurrentEmail(props);
    }
  }, []);

  return (
    <li
      class={`group flex items-start gap-3 py-3 px-4 cursor-pointer transition-all duration-150 border-l-2 animate-fade-in ${
        isActive
          ? 'bg-indigo-500/10 border-l-indigo-400'
          : 'border-l-transparent hover:bg-[#334155]/50'
      }`}
      onClick={() => {
        setCurrentEmail(props);
        if (window.matchMedia('(max-width: 767px)').matches) {
          pendingMobileNav.set(true);
        }
      }}
    >
      <div class={`w-9 h-9 min-w-[36px] rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${getAvatarColor(senderName)}`}>
        {getInitials(senderName)}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-baseline gap-2">
          <h3 class={`text-sm truncate ${isActive ? 'text-white font-semibold' : 'text-slate-200 font-medium'}`}>
            {senderName}
          </h3>
          <span class="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">{timeRelative}</span>
        </div>
        <p class={`text-xs mt-0.5 truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
          {subject || '(no subject)'}
        </p>
      </div>
    </li>
  );
}
