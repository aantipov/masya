import { makePrototypeMutation } from '@/queries/prototype';
import { setErrorMap } from 'astro/zod';
import { Show, createSignal } from 'solid-js';

interface InputProps {
  setPrototype: (value: string) => void;
  setIsError: (value: boolean) => void;
}

export default function Input({ setPrototype, setIsError }: InputProps) {
  let openAiKey;
  if (typeof window !== 'undefined') {
    openAiKey = window.localStorage.getItem('openai-key');
  }
  const prototypeM = makePrototypeMutation();
  const [prompt, setPrompt] = createSignal('');
  const [aiKey, setAIKey] = createSignal(openAiKey || '');
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const result = await prototypeM.mutateAsync({
        prompt: prompt(),
        aiKey: aiKey(),
      });
      setPrototype(result);
      setIsError(false);
    } catch (error) {
      setIsError(true);
    }
  };

  return (
    <div class="bg-gray-800 p-8">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(event) => {
          if (event.metaKey && event.key === 'Enter') {
            handleSubmit(event);
          }
        }}
      >
        <input
          type="password"
          class="h-200px mb-2 w-full rounded border border-gray-600 bg-gray-900 p-2 text-white"
          placeholder="OPENAI API KEY"
          autocomplete="off"
          onInput={(event) => {
            setAIKey(event.target.value);
          }}
        />
        <textarea
          id="userInput"
          class="h-200px w-full rounded border border-gray-600 bg-gray-900 p-2 text-white"
          placeholder="Describe your UI or changes..."
          onInput={(event) => {
            setPrompt(event.target.value);
          }}
        >
          {prompt()}
        </textarea>

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
