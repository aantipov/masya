import { makePrototypeMutation } from '@/queries/prototype';
import { Show, createSignal, type Setter, createEffect } from 'solid-js';

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
        <textarea
          id="userInput"
          ref={(el) => (userInputRef = el)}
          class="h-200px w-full rounded border border-gray-600 bg-gray-900 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={prototypeM.isPending}
          placeholder={
            hasUIGenerated() ? 'Describe changes...' : 'Describe your UI...'
          }
          value={prompt()}
          onInput={(event) => {
            setPrompt(event.target.value);
          }}
        />

        <div class="flex justify-end">
          <Show when={!prototypeM.isPending}>
            <button
              type="submit"
              disabled={prototypeM.isPending}
              class="mt-2 self-end rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Generate
            </button>
          </Show>
          <Show when={prototypeM.isPending}>
            <button
              type="submit"
              disabled
              class="`mt-2 cursor-not-allowed self-end rounded bg-blue-300 px-4 py-2 text-white"
            >
              Generating...
            </button>
          </Show>
        </div>
      </form>
    </div>
  );
}
