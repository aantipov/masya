import { makePrototypeMutation } from '@/queries/prototype';

export default function Input() {
  const protoM = makePrototypeMutation();

  return (
    <div class="bg-gray-800 p-8">
      <textarea
        id="userInput"
        class="h-200px w-full rounded border border-gray-600 bg-gray-900 p-2 text-white"
        placeholder="Describe your UI or changes..."
      ></textarea>
      <div class="flex justify-end">
        <button
          disabled={protoM.isPending}
          id="sendInput"
          class="mt-2 self-end rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            protoM.mutate('Hello World!');
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
