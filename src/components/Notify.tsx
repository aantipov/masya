import { createEffect } from 'solid-js';
import { notify } from '@/sharedState';

export default function Notify() {
  let notifyRef: HTMLDivElement;

  createEffect(() => {
    const { text } = notify();
    if (!text) return;
    setTimeout(() => {
      notifyRef.textContent = text;
      notifyRef.classList.remove('-translate-y-full');
      notifyRef.classList.add('translate-y-0');

      // After 3 seconds, slide the notification back up and hide it
      setTimeout(() => {
        notifyRef.classList.remove('translate-y-0');
        notifyRef.classList.add('-translate-y-full');
      }, 1500);
    }, 100);
  });

  return (
    <div
      ref={(el) => (notifyRef = el)}
      class="fixed left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-full transform rounded bg-purple-600 px-4 py-2 text-white shadow-lg transition-transform duration-500 ease-in-out"
    >
      default text
    </div>
  );
}
