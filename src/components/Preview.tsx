import { Match, Show, Switch, createSignal, createEffect } from 'solid-js';
import PreviewSourceCode from './PreviewSourceCode';
import getPrettiedCode from '@/helpers/getPrettiedCode';
import getGroovy from '@/images/get-groovy.png';
import { getPrototypeStream, usePrototypeM } from '@/sharedState';

export default function Preview() {
  const [showCode, setShowCode] = createSignal(false);
  const [iframeHeight, setIframeHeight] = createSignal(0);
  const [getPrototypeM] = usePrototypeM();
  let iframeRef: HTMLIFrameElement;

  createEffect(() => {
    iframeRef.contentWindow?.postMessage(getPrototypeStream(), '*');
  });

  createEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.height && event.data.type === 'iframe') {
          setIframeHeight(event.data.height);
        }
      },
      true,
    );
  });

  const showIframe = () => {
    const prototypeM = getPrototypeM()!;
    return (
      (getPrototypeStream() || prototypeM.data) &&
      !prototypeM.isError &&
      !showCode()
    );
  };

  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script> 
      </head>
      <body>
        <div id="content" class="bg-gray-700 w-fit mx-auto pt-2"></div>
        <script>
          window.addEventListener('message', (event) => {
           document.getElementById('content').innerHTML = event.data;
           window.parent.postMessage({height: document.documentElement.scrollHeight, type: 'iframe'}, '*');
          });
        </script>
      </body>
    </html> 
  `;

  const getActionsToolbar = () => {
    const prototypeM = getPrototypeM()!;
    return (
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
  };

  const getData = () => getPrototypeM()!.data;
  const getIsPending = () => getPrototypeM()!.isPending;
  const getIsError = () => getPrototypeM()!.isError;

  return (
    <div class="h-full">
      <Show when={!!getData() && !getIsPending()}>{getActionsToolbar()}</Show>

      {/* Iframe with the generated UI */}
      <iframe
        ref={(el) => (iframeRef = el)}
        srcdoc={iframeHtml}
        title="Preview"
        sandbox="allow-scripts"
        width="100%"
        height={iframeHeight() | 150}
        class={`${showIframe() ? '' : 'hidden'}`}
      />

      {/* Display Initial Fallback message or source code */}
      <Show when={!showIframe()}>
        <Switch>
          <Match when={showCode()}>
            <PreviewSourceCode />
          </Match>

          <Match when={!getData() && getIsError()}>
            <div>
              <h1 class="text-center text-2xl font-bold text-red-500">Error</h1>
              <h2 class="mt-4 text-center text-xl font-bold">
                Please try again
              </h2>
              <div>
                <pre>{JSON.stringify(getPrototypeM()!.error, null, 2)}</pre>
              </div>
            </div>
          </Match>
          <Match when={!getData() && !getIsError()}>
            <div class="flex items-center justify-center">
              <img
                src={getGroovy.src}
                alt="Let's get groovy!"
                width={getGroovy.width}
                height={getGroovy.height}
              />
            </div>
          </Match>
        </Switch>
      </Show>
    </div>
  );
}
