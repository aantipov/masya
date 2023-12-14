import {
  Match,
  Show,
  Switch,
  createMemo,
  createResource,
  createSignal,
} from 'solid-js';
import * as prettier from 'prettier';
import prettierHtmlParser from 'prettier/plugins/html';
import hljs from 'highlight.js/lib/core';
import hlHtml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css';
import type { makePrototypeMutation } from '@/queries/prototype';

interface PreviewProps {
  prototypeM: ReturnType<typeof makePrototypeMutation>;
}

export default function Preview({ prototypeM }: PreviewProps) {
  hljs.registerLanguage('javascript', hlHtml);
  const [showCode, setShowCode] = createSignal(false);

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
        <div>${prototypeM.data}</div>
      </body>
    </html> 
    `,
  );

  const [prettiedHtml] = createResource(
    () => prototypeM.data,
    async (val) => {
      if (typeof window != undefined) {
        const res = await prettier.format(`<div>${val}</div>`, {
          parser: 'html',
          plugins: [prettierHtmlParser],
        });
        return res;
      }
      return '';
    },
  );
  const beautifiedHtml = createMemo(() => {
    const res = hljs.highlight(prettiedHtml() || '', {
      language: 'html',
    }).value;
    return res;
  });

  return (
    <div class="h-full">
      <Switch fallback={<div>Fallback</div>}>
        <Match when={!showCode()}>
          <Show when={!prototypeM.data && prototypeM.isError}>
            <div>
              <h1 class="text-center text-2xl font-bold text-red-500">Error</h1>
              <h2 class="mt-4 text-center text-xl font-bold">
                Please try again
              </h2>
            </div>
          </Show>
          <Show when={!prototypeM.data && !prototypeM.isError}>
            <div>
              <h1 class="text-center text-2xl font-bold">Preview Section</h1>
              <h2 class="mt-4 text-center text-xl font-bold">
                of your prototype
              </h2>
            </div>
          </Show>
          <Show when={prototypeM.data && !prototypeM.isError}>
            <iframe
              srcdoc={fullPrototype()}
              title="Preview"
              sandbox="allow-scripts"
              width="100%"
              height="100%"
              class="h-full"
            />
          </Show>
        </Match>

        {/* Show source code */}
        <Match when={showCode()}>
          <pre class="theme-atom-one-dark shadow-3xl tab-size relative h-full max-w-full overflow-hidden overflow-y-scroll rounded-md text-sm">
            <span class="hljs mb-0 block min-h-full overflow-auto p-4">
              <code innerHTML={beautifiedHtml()} />
            </span>
          </pre>
        </Match>
      </Switch>

      {/* Actions Toolbar  */}
      <div class="absolute right-0 top-0 mr-2 mt-2 rounded bg-black bg-opacity-50 p-2 text-white opacity-0 transition-opacity group-hover/toolbar:opacity-100">
        {showCode() && (
          <button
            class="mr-2 rounded bg-white p-1 text-sm text-black"
            onClick={() => {
              // copy to clipboard
              if (typeof window != undefined) {
                navigator.clipboard.writeText(prettiedHtml() || '');
              }
            }}
          >
            Copy
          </button>
        )}
        <button
          class="rounded bg-white p-1 text-sm text-black"
          onClick={() => setShowCode(!showCode())}
        >
          {'</>'}
        </button>
      </div>
    </div>
  );
}
