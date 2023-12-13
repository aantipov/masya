import { For, Show } from 'solid-js';

export default function History() {
  const messages = [
    'Create a header with navigation links...',
    'Add a responsive sidebar',
    'Design a user profile card...',
    'Implement a photo gallery grid',
    'Build a contact form with validation...',
    'Create a footer with social media links',
    'Add a modal for newsletter subscription...',
    'Implement a dark mode toggle feature',
  ];
  const SELECTED = 2;
  const EXPAND_LIMIT = 35;
  return (
    <div
      id="promptsHistory"
      class="relative flex-grow space-y-6 overflow-y-auto p-8"
    >
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-2xl">
        <div>History block: To Be Implemented later</div>
      </div>
      <For each={messages}>
        {(item, i) => (
          <>
            <Show when={i() !== SELECTED}>
              <div class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700 hover:shadow-md">
                <p>{item}</p>
                <Show when={item.length >= EXPAND_LIMIT}>
                  <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
                    Expand
                  </a>
                </Show>
              </div>
            </Show>
            <Show when={i() === SELECTED}>
              <div class="prompt cursor-not-allowed rounded bg-gray-700 p-4 text-white">
                <p>{item}</p>
                <Show when={item.length >= EXPAND_LIMIT}>
                  <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
                    Expand
                  </a>
                </Show>
              </div>
            </Show>
          </>
        )}
      </For>
    </div>
  );
}
