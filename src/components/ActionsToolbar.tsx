import Copy from '@/icons/Copy';
import Code from '@/icons/Code';
import clsx from 'clsx/lite';
import type { Accessor } from 'solid-js';

interface ActionsToolbarProps {
  onCopy: () => void;
  onCode: () => void;
  isCodeActive: Accessor<boolean>;
}

export default function ActionsToolbar({
  onCopy,
  onCode,
  isCodeActive,
}: ActionsToolbarProps) {
  return (
    <div class="absolute right-0 top-0 z-10 mr-2 mt-2 box-content h-8 rounded bg-black bg-opacity-80 px-3 py-2 text-white opacity-0 transition-opacity group-hover/toolbar:opacity-100">
      <button
        class="rounded bg-transparent text-gray-300 ring-gray-400 hover:text-gray-50 focus:outline-none active:ring-1"
        onClick={onCopy}
      >
        <Copy class="h-8 w-8" />
      </button>

      <button
        class={clsx(
          'ml-2 rounded bg-transparent text-gray-300 ring-gray-400 hover:text-gray-50 focus:outline-none active:ring-1',
          isCodeActive() && 'text-gray-50 ring-1',
        )}
        onClick={onCode}
      >
        <Code class="h-8 w-8" />
      </button>
    </div>
  );
}
