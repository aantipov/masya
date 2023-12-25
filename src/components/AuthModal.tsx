import { Show, createSignal, type Setter, createEffect } from 'solid-js';
import Button from '@/atoms/Button';
import { useClerk, useUserAPIKey } from '@/sharedState';

export default function AuthModal() {
  let inputRef: HTMLInputElement;
  let clerkSignInRef: HTMLDivElement;
  const { getClerk, getClerkLoaded } = useClerk();
  const [userAPIKey, setUserAPIKey] = useUserAPIKey();
  const [inputKey, setInputKey] = createSignal(userAPIKey());
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setUserAPIKey(inputKey());
  };
  const [getIsExplainerOpen, setIsExplainerOpen] = createSignal(false);

  function isInputKeyValid() {
    const val = inputKey();
    return val !== null && val.length > 30;
  }

  createEffect(() => {
    const clerk = getClerk();
    const isClerkLoaded = getClerkLoaded();
    if (isClerkLoaded && !clerk!.user) {
      clerk!.mountSignIn(clerkSignInRef);
    }
  });

  createEffect(() => {
    inputRef && inputRef.focus();
  });
  return (
    <div>
      {/* <!-- Modal Background --> */}
      <div class="fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-800 bg-opacity-70"></div>

      {/* <!-- Modal --> */}
      <div class="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-gray-900 p-5 shadow-lg">
        <div class="flex gap-2">
          <div ref={(el) => (clerkSignInRef = el)}></div>

          <div class="_flex-grow self-center text-center text-2xl text-gray-200">
            OR
          </div>

          <div class="ml-7 w-[400px] rounded-xl border border-gray-700 bg-gray-800 p-4">
            <div class="mb-3 text-xl text-gray-200">
              Provide your own OpenAI API Key 🔑
            </div>
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
              <div
                class="mb-1 flex cursor-pointer items-center italic text-blue-400"
                onClick={() => setIsExplainerOpen(!getIsExplainerOpen())}
              >
                Why Use Your API Key?
                <svg
                  class="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d={
                      getIsExplainerOpen() ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'
                    }
                  ></path>
                </svg>
              </div>
              <div
                class={`mb-4 overflow-hidden text-gray-200 transition-all duration-500 ${
                  getIsExplainerOpen() ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <div>
                  By providing your OpenAI API Key, you unlock the full
                  potential of our UI Generator app. This option allows you to
                  enjoy unlimited UI generation capabilities, surpassing the
                  daily limits set for Google login users.
                </div>
                <div class="mb-1 mt-2 italic">How We Handle Your Key:</div>{' '}
                <div>
                  <div class="mb-1">
                    1. <span class="font-semibold">Local Storage:</span> Your
                    API Key is stored locally in your browser's session storage.
                  </div>
                  <div class="mb-1">
                    2. <span class="font-semibold">Privacy and Security:</span>{' '}
                    We do not transmit or store your key on our servers.
                  </div>
                  <div>
                    3. <span class="font-semibold">Automatic Cleanup:</span> The
                    key is automatically cleared from your browser when you
                    close the tab or browser, ensuring your security and peace
                    of mind.
                  </div>
                  <div class="mt-2">
                    Don't have an API Key yet? Get one{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      class="text-blue-400 hover:text-blue-300"
                    >
                      here
                    </a>
                    .
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={!isInputKeyValid()}>
                Continue
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
