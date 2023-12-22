import { Show, createSignal, type Setter, createEffect } from 'solid-js';
import Button from '@/atoms/Button';

export default function EnterKeyModal() {
  let inputRef: HTMLInputElement;
  const [key, setKey] = createSignal(
    window.sessionStorage.getItem('openai-key'),
  );
  const [inputKey, setInputKey] = createSignal(key());
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setKey(inputKey());
    window.sessionStorage.setItem('openai-key', inputKey()!);
  };

  function isInputKeyValid() {
    const val = inputKey();
    return val !== null && val.length > 30;
  }

  createEffect(() => {
    inputRef.focus();
  });
  return (
    <Show when={key() === null}>
      {/* <!-- Modal Background --> */}
      <div class="fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-800 bg-opacity-70"></div>

      {/* <!-- Modal --> */}
      <div class="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-gray-900 p-5 shadow-lg">
        <h2 class="mb-4 text-xl font-bold text-gray-100">
          OpenAI API Key Required
        </h2>
        <form onSubmit={handleSubmit} id="openai-key-form">
          <input
            ref={(el) => (inputRef = el)}
            type="password"
            aria-label="OpenAI API Key"
            placeholder="Paste your OpenAI API Key here"
            class="mb-4 h-10 w-full rounded-lg border-2 border-gray-600 bg-gray-700 px-5 pr-16 text-sm text-gray-100 placeholder-gray-400 focus:outline-none"
            onInput={(event) => {
              setInputKey(event.target.value);
            }}
          />
          {/* <!-- Explanation Text --> */}
          <p class="mb-4 text-sm text-gray-100">
            To use our UI prototype generator, your OpenAI API Key is required.
            It enables the core functionality of this website. Rest assured,
            your key will not be stored on our servers or transmitted elsewhere.
            It will only be saved locally in your browser's session storage and
            will be removed when you close the tab or browser.
          </p>
          {/* <Show when={isInputKeyValid()}> */}
          <Button type="submit" disabled={!isInputKeyValid()}>
            Continue
          </Button>
        </form>
      </div>
    </Show>
  );
}
