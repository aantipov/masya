import Copy from '@/icons/Copy';
import Code from '@/icons/Code';

interface ActionsToolbarProps {
  onCopy: () => void;
  onCode: () => void;
}

export default function ActionsToolbar({
  onCopy,
  onCode,
}: ActionsToolbarProps) {
  return (
    <div class="absolute right-0 top-0 z-10 mr-2 mt-2 rounded bg-black bg-opacity-50 px-4 py-2 text-white opacity-0 transition-opacity group-hover/toolbar:opacity-100">
      <button class="rounded bg-white bg-opacity-10 p-1 text-gray-300 hover:bg-opacity-20 focus:outline-none active:ring-2 active:ring-purple-600 active:ring-opacity-50">
        <Copy class="h-8 w-8" onClick={onCopy} />
      </button>

      <button class="ml-2 rounded bg-white bg-opacity-10 p-1 text-gray-300 hover:bg-opacity-20 focus:outline-none active:ring-2 active:ring-purple-600 active:ring-opacity-50">
        <Code class="h-8 w-8" onClick={onCode} />
      </button>
    </div>
  );
}
