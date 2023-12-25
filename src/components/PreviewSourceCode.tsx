import { createMemo, createResource } from 'solid-js';
import getPrettiedCode from '@/helpers/getPrettiedCode';
import hljs from 'highlight.js/lib/core';
import hlHtml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/atom-one-dark.css';
import { usePrototypeM } from '@/sharedState';

export default function Preview() {
  hljs.registerLanguage('javascript', hlHtml);
  const [getPrototypeM] = usePrototypeM();

  const [prettiedHtml] = createResource(
    () => getPrototypeM()!.data,
    async (val) => {
      const res = await getPrettiedCode(val);
      return res;
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
      <pre class="theme-atom-one-dark shadow-3xl tab-size relative h-full max-w-full overflow-hidden overflow-y-scroll rounded-md text-sm">
        <span class="hljs mb-0 block min-h-full overflow-auto p-4">
          <code innerHTML={beautifiedHtml()} />
        </span>
      </pre>
    </div>
  );
}
