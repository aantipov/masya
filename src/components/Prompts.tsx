import { For, Show } from 'solid-js';

export default function Prompts() {
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
  const selected = 2;
  return (
    <div id="promptsHistory" class="flex-grow space-y-6 overflow-y-auto p-8">
      <For each={messages}>
        {(item, i) => (
          <>
            <Show when={i() !== selected}>
              <div class="prompt cursor-pointer rounded bg-gray-600 p-4 text-white hover:bg-gray-700 hover:shadow-md">
                <p>User: {item}</p>
                <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
                  Expand
                </a>
              </div>
            </Show>
            <Show when={i() === selected}>
              <div class="prompt cursor-not-allowed rounded bg-gray-700 p-4 text-white">
                <p>User: {item}</p>
                <a href="#" class="text-sm text-blue-500 hover:text-blue-700">
                  Expand
                </a>
              </div>
            </Show>
          </>
        )}
      </For>
    </div>
  );
}
