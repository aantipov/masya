import { Show, createMemo } from 'solid-js';

interface PreviewProps {
  prototype: () => string;
  isError: () => boolean;
}

export default function Preview({ prototype, isError }: PreviewProps) {
  const fullPrototype = createMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script> 
      </head>
      <body>
      <div>${prototype()}</div>
      </body>
    
    `,
  );

  return (
    <>
      <Show when={!prototype() && isError()}>
        <div>
          <h1 class="text-center text-2xl font-bold text-red-500">Error</h1>
          <h2 class="mt-4 text-center text-xl font-bold">Please try again</h2>
        </div>
      </Show>
      <Show when={!prototype() && !isError()}>
        <div>
          <h1 class="text-center text-2xl font-bold">Preview Section</h1>
          <h2 class="mt-4 text-center text-xl font-bold">of your prototype</h2>
        </div>
      </Show>
      <Show when={prototype() && !isError()}>
        <iframe
          srcdoc={fullPrototype()}
          title="Preview"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
        />
      </Show>
    </>
  );
}
