import { useStore } from '@nanostores/preact';
import { arr, getEmails, setCurrentEmail, type Email } from '../store/current-email';
import { useEffect } from 'preact/hooks';

export interface ItemProps extends Email {
  index?: number;
}

export default function Items() {
  const $arr = useStore(arr);

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get('email')
    if (!email) return
    getEmails(email)
  }, [])

  return <ul class="mt-6">
    {$arr.map((item, index) => (
      <Item {...item} index={index} />
    ))}
  </ul>
}

export function Item(props: ItemProps) {
  const { date, from, headers, html, messageId, priority, receivedAt, subject, text, to, index, receivedDate, } = props ?? {}

  const rtf1 = new Intl.RelativeTimeFormat('es', { style: 'long' });
  // @ts-expect-error: err
  const diff = new Date(date) - new Date();
  // @ts-expect-error: err
  const seconds = parseInt(diff / 1000);
  // @ts-expect-error: err
  const minutes = parseInt(seconds / 60);
  // @ts-expect-error: err
  const hours = parseInt(minutes / 60);

  const timeRelative = (() => {
    if (hours < 0) return rtf1.format(hours, 'hours')
    if (minutes < 0) return rtf1.format(minutes, 'minutes')
    if (seconds < 0) return rtf1.format(seconds, 'seconds')
    return 'default'
  })()

  useEffect(() => {

    if (index === 0) {
      setCurrentEmail(props)
    }
  }, [])

  return (
    <li
      class="py-5 border-b border-gray-700 px-3 transition hover:bg-indigo-700"
      onClick={() => {
        setCurrentEmail(props)
      }}
    >
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{from[0].name}</h3>
        <p class="text-md text-gray-400">{timeRelative}</p>
      </div>
      <div class="text-md italic text-gray-400">{subject}</div>
    </li>

  );
}
