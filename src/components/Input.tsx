import { makePrototypeMutation } from '@/queries/prototype';
import { Show, createSignal, type Setter, createEffect } from 'solid-js';
import EnterKeyIcon from '@/icons/EnterKey';
import LoadingIcon from '@/icons/Loading';

interface InputProps {
  prototypeM: ReturnType<typeof makePrototypeMutation>;
  setPrototypeStream: Setter<string>;
}

export default function Input({ prototypeM, setPrototypeStream }: InputProps) {
  let userInputRef: HTMLTextAreaElement;
  const [prompt, setPrompt] = createSignal('');
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const aiKey = window.sessionStorage.getItem('openai-key');
    prototypeM.mutate({
      prompt: prompt(),
      aiKey: aiKey!,
      setPrototypeStream,
      prototype: prototypeM.data,
    });
  };
  const hasUIGenerated = () => !!prototypeM.data;

  createEffect(() => {
    if (!prototypeM.isPending && prototypeM.isSuccess) {
      setPrompt('');
      userInputRef.focus();
    }
  });

  return (
    <div class="bg-gray-800 p-8">
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
        <div class="relative flex min-w-[400px] items-center">
          <textarea
            ref={(el) => (userInputRef = el)}
            class="max-h-[120px] flex-1 resize-none overflow-y-scroll rounded bg-blue-700 bg-transparent bg-opacity-25 pb-3 pl-3 pr-12 pt-4 leading-tight text-gray-300 placeholder-gray-400 focus:outline-none"
            rows="1"
            aria-label="UI description"
            disabled={prototypeM.isPending}
            placeholder={
              hasUIGenerated() ? 'Describe changes' : 'Describe your UI'
            }
            value={prompt()}
            onInput={(event) => {
              setPrompt(event.target.value);
              event.target.style.height = 'auto';
              event.target.style.height = event.target.scrollHeight + 'px';
            }}
          ></textarea>
          <button
            class="absolute bottom-0 right-0 mb-2 mr-2 rounded border-4 border-purple-500 bg-purple-500 px-1 py-1 text-sm text-white transition-colors duration-150 ease-in-out hover:border-purple-600 hover:bg-purple-600 focus:outline-none"
            type="button"
            id="generateButton"
          >
            <Show when={!prototypeM.isPending}>
              <EnterKeyIcon class="h-4 w-4" />
            </Show>
            <Show when={prototypeM.isPending}>
              <LoadingIcon class="h-4 w-4 animate-spin text-white" />
            </Show>
          </button>
          <div class="absolute bottom-0 left-0 right-0 border-b-2 border-purple-400"></div>
        </div>
      </form>
    </div>
  );
}
