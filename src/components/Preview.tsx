import {
  Match,
  Show,
  Switch,
  createSignal,
  createEffect,
  onCleanup,
} from 'solid-js';
import PreviewSourceCode from './PreviewSourceCode';
import getPrettiedCode from '@/helpers/getPrettiedCode';
import getGroovy from '@/images/get-groovy.png';
import { usePrototypeM } from '@/sharedState';
import LoadingIcon from '@/icons/Loading';
import ActionsToolbar from '@/components/ActionsToolbar';
import { setNotify } from '@/sharedState';

export default function Preview() {
  const [showCode, setShowCode] = createSignal(false);
  const [iframeHeight, setIframeHeight] = createSignal(0);
  const { prototypeM, getPrototypeStream, lastPrototype } = usePrototypeM();
  const [showLastUI, setShowLastUI] = createSignal(true);
  let iframeRef: HTMLIFrameElement;

  // Show last generated prototype when pending until
  // - either new prototype is generated. Then show the new prototype
  // - timeout of 5 seconds. Then show the stream
  createEffect(() => {
    let timeoutId: any;
    if (prototypeM.isPending) {
      setShowLastUI(true);
      timeoutId = setTimeout(() => {
        setShowLastUI(false);
      }, 4000);
    } else {
      clearTimeout(timeoutId);
    }
    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  createEffect(() => {
    const data =
      showLastUI() && lastPrototype() ? lastPrototype() : getPrototypeStream();
    iframeRef.contentWindow?.postMessage(data, '*');
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
    return (
      (lastPrototype() || getPrototypeStream()) &&
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

  const getData = () => prototypeM.data;
  const getIsPending = () => prototypeM.isPending;
  const getIsError = () => prototypeM.isError;
  async function onCopy() {
    const prettiedHtml = prototypeM.data
      ? await getPrettiedCode(prototypeM.data)
      : '';
    navigator.clipboard.writeText(prettiedHtml);
    setNotify({ text: 'Copied to clipboard' });
  }

  return (
    <div class="h-full">
      <Show when={!!getData() && !getIsPending()}>
        <ActionsToolbar
          onCode={() => setShowCode(!showCode())}
          onCopy={onCopy}
        />
      </Show>
      <Show when={prototypeM.isPending && !!getPrototypeStream()}>
        <div class="absolute left-6 top-6">
          <LoadingIcon class="h-8 w-8 animate-spin text-white" />
        </div>
      </Show>

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
                <pre>{JSON.stringify(prototypeM.error, null, 2)}</pre>
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
