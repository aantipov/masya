import { Show, createSignal, createEffect } from 'solid-js';
import EnterKeyIcon from '@/icons/EnterKey';
import LoadingIcon from '@/icons/Loading';
import { usePrototypeM, useMessages } from '@/sharedState';
import clsx from 'clsx/lite';

export default function Input() {
  let userInputRef: HTMLTextAreaElement;
  const [prompt, setPrompt] = createSignal('');
  const [isFocused, setIsFocused] = createSignal(false);
  const { prototypeM } = usePrototypeM();
  const { addPrompt } = useMessages();
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const aiKey = window.sessionStorage.getItem('openai-key');
    addPrompt(prompt());
    prototypeM.mutate({
      prompt: prompt(),
      aiKey: aiKey!,
      prototype: prototypeM.data,
    });
  };
  const hasUIGenerated = () => !!prototypeM.data;

  createEffect(() => {
    if (!prototypeM.isPending) {
      setPrompt('');
      userInputRef.focus();
    }
  });

  return (
    <div>
      <form
        id="input-form"
        onSubmit={handleSubmit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            if (event.shiftKey) {
              // new line
            } else {
              event.preventDefault();
              handleSubmit(event);
            }
          }
        }}
      >
        <div class="relative flex min-w-[500px] items-center">
          <textarea
            ref={(el) => (userInputRef = el)}
            class="max-h-[150px] flex-1 resize-none overflow-y-scroll rounded border border-gray-700 bg-gray-900 pb-3 pl-3 pr-12 pt-4 leading-tight text-gray-300 placeholder-gray-400 shadow-inner focus:outline-none"
            rows="1"
            aria-label="UI description"
            disabled={prototypeM.isPending}
            placeholder={
              hasUIGenerated() ? 'Describe changes' : 'Describe your UI'
            }
            value={prompt()}
            onfocus={() => setIsFocused(true)}
            onblur={() => setIsFocused(false)}
            onInput={(event) => {
              setPrompt(event.target.value);
              event.target.style.height = 'auto';
              event.target.style.height = event.target.scrollHeight + 'px';
            }}
          ></textarea>
          <button
            class={clsx(
              'absolute bottom-0 right-0 mb-2 mr-2 rounded border-4 px-1 py-1 text-sm text-white transition-colors duration-150 ease-in-out focus:outline-none',
              !isFocused() && 'border-transparent',
              isFocused() &&
                'border-purple-500 bg-purple-500 hover:border-purple-600 hover:bg-purple-600 ',
            )}
            type={prototypeM.isPending ? 'button' : 'submit'}
          >
            <Show when={!prototypeM.isPending}>
              <EnterKeyIcon class={clsx('h-4 w-4')} />
            </Show>
            <Show when={prototypeM.isPending}>
              <LoadingIcon class="h-4 w-4 animate-spin text-white" />
            </Show>
          </button>
          <div
            class={clsx(
              'absolute bottom-0 left-0 right-0 transition-all',
              !isFocused() && 'border-transparent',
              isFocused() && 'border-b-2 border-purple-400',
            )}
          ></div>
        </div>
      </form>
    </div>
  );
}
