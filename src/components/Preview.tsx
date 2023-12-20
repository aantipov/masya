import {
  Match,
  Show,
  Switch,
  createSignal,
  type Accessor,
  createEffect,
} from 'solid-js';
import type { makePrototypeMutation } from '@/queries/prototype';
import PreviewSourceCode from './PreviewSourceCode';
import getPrettiedCode from '@/helpers/getPrettiedCode';

interface PreviewProps {
  prototypeM: ReturnType<typeof makePrototypeMutation>;
  prototypeStream: Accessor<string>;
}

export default function Preview({ prototypeM, prototypeStream }: PreviewProps) {
  const [showCode, setShowCode] = createSignal(false);
  let iframeRef: HTMLIFrameElement;

  createEffect(() => {
    iframeRef.contentWindow?.postMessage(prototypeStream(), '*');
  });

  const showIframe = () => {
    return prototypeStream() && !prototypeM.isError && !showCode();
  };

  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script> 
        <script>
        document.querySelectorAll('a).forEach((el) => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
          });
        });
        </script>
      </head>
      <body>
        <div id="content"></div>
        <script>
          window.addEventListener('message', (event) => {
            document.getElementById('content').innerHTML = event.data;
          }, false);
        </script>
      </body>
    </html> 
  `;

  const actionsToolbar = (
    <div class="absolute right-0 top-0 z-10 mr-2 mt-2 rounded bg-black bg-opacity-50 p-2 text-white opacity-0 transition-opacity group-hover/toolbar:opacity-100">
      {/* Copy to clipboard */}
      <button
        class="mr-2 rounded bg-white p-1 text-sm text-black"
        onClick={async () => {
          const prettiedHtml = prototypeM.data
            ? await getPrettiedCode(prototypeM.data)
            : '';
          navigator.clipboard.writeText(prettiedHtml);
        }}
      >
        Copy
      </button>

      {/* Show source code */}
      <button
        class="rounded bg-white p-1 text-sm text-black"
        onClick={() => setShowCode(!showCode())}
      >
        {'</>'}
      </button>
    </div>
  );

  return (
    <div class="h-full">
      {actionsToolbar}

      {/* Iframe with the generated UI */}
      <iframe
        // @ts-ignore
        ref={iframeRef}
        srcdoc={iframeHtml}
        title="Preview"
        sandbox="allow-scripts"
        width="100%"
        height="100%"
        class={`h-full ${showIframe() ? '' : 'hidden'}`}
      />

      {/* Display Initial Fallback message or source code */}
      <Show when={!showIframe()}>
        <Switch>
          <Match when={showCode()}>
            <PreviewSourceCode prototypeM={prototypeM} />
          </Match>

          <Match when={!prototypeM.data && prototypeM.isError}>
            <div>
              <h1 class="text-center text-2xl font-bold text-red-500">Error</h1>
              <h2 class="mt-4 text-center text-xl font-bold">
                Please try again
              </h2>
              <div>
                <pre>{JSON.stringify(prototypeM.error, null, 2)}</pre>
              </div>
            </div>
          </Match>
          <Match when={!prototypeM.data && !prototypeM.isError}>
            <div>
              <h1 class="text-center text-2xl font-bold">Preview Section</h1>
              <h2 class="mt-4 text-center text-xl font-bold">
                of your prototype
              </h2>
            </div>
          </Match>
        </Switch>
      </Show>
    </div>
  );
}
