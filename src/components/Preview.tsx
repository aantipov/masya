import { Show, createSignal, createEffect, onMount } from 'solid-js';
import PreviewSourceCode from './PreviewSourceCode';
import getPrettiedCode from '@/helpers/getPrettiedCode';
import { usePrototypeM, type MessageT } from '@/sharedState';
import LoadingIcon from '@/icons/Loading';
import ActionsToolbar from '@/components/ActionsToolbar';
import { setNotify } from '@/sharedState';

interface PropsT {
  message: MessageT;
}

export default function Preview({ message }: PropsT) {
  const [showCode, setShowCode] = createSignal(false);
  const [iframeHeight, setIframeHeight] = createSignal(150);
  const { prototypeM } = usePrototypeM();
  let iframeRef: HTMLIFrameElement;

  createEffect(() => {
    iframeRef.contentWindow?.postMessage(
      {
        response: message.response,
        isFinished: message.isFinished,
      },
      '*',
    );
  });

  function adjustIframeHeight(event: MessageEvent<any>) {
    if (event.data.height && event.data.type === 'iframe') {
      setIframeHeight(event.data.height);
    }
  }

  onMount(() => {
    window.addEventListener('message', adjustIframeHeight, true);
  });

  onMount(() => {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.isFinished && event.data.type === 'iframe') {
          removeEventListener('message', adjustIframeHeight, true);
        }
      },
      true,
    );
  });

  const showIframe = () => {
    return !prototypeM.isError && !showCode();
  };

  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script> 
      </head>
      <body class="bg-gray-100">
        <div id="content" class="p-5"></div>
        <script>
          window.addEventListener('message', (event) => {
           document.getElementById('content').innerHTML = event.data.response;
           setTimeout(() => {
            window.parent.postMessage({height: document.documentElement.scrollHeight, type: 'iframe'}, '*');
            if (event.data.isFinished) {
              window.parent.postMessage({isFinished: true, type: 'iframe'}, '*');
            }
           });
          });
        </script>
      </body>
    </html> 
  `;

  async function onCopy() {
    const prettiedHtml = await getPrettiedCode(message.response);
    navigator.clipboard.writeText(prettiedHtml);
    setNotify({ text: 'Copied to clipboard' });
  }

  return (
    <div class="relative">
      <Show when={!prototypeM.isError}>
        <ActionsToolbar
          onCode={() => setShowCode(!showCode())}
          onCopy={onCopy}
        />
      </Show>
      <Show when={!message.isFinished}>
        <div class="absolute left-6 top-6">
          <LoadingIcon class="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </Show>

      {/* Iframe with the generated UI */}
      <iframe
        ref={(el) => (iframeRef = el)}
        srcdoc={iframeHtml}
        title="Preview"
        sandbox="allow-scripts"
        width="100%"
        height={iframeHeight()}
        class={`${showIframe() ? '' : 'hidden'} min-h-full`}
      />

      <Show when={showCode()}>
        <PreviewSourceCode code={message.response} />
      </Show>

      <Show when={prototypeM.isError}>
        <div>
          <h1 class="text-center text-2xl font-bold text-red-500">Error</h1>
          <h2 class="mt-4 text-center text-xl font-bold">Please try again</h2>
          <div>
            <pre>{JSON.stringify(prototypeM.error, null, 2)}</pre>
          </div>
        </div>
      </Show>
    </div>
  );
}
