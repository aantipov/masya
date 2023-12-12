import { makePrototypeMutation } from '@/queries/prototype';
import { createSignal } from 'solid-js';

export default function Input() {
  const protoM = makePrototypeMutation();
  const [prompt, setPrompt] = createSignal('');
  const [aiKey, setAIKey] = createSignal('');
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    protoM.mutate({
      prompt: prompt(),
      aiKey: aiKey(),
    });
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
          <button
            type="submit"
            disabled={protoM.isPending}
            class="mt-2 self-end rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
