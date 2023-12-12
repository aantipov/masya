import 'solid-devtools/setup';
import { createSignal } from 'solid-js';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import Input from './components/Input';
import Prompts from './components/Prompts';
import Preview from './components/Preview';

const queryClient = new QueryClient();

export default function App() {
  const [prototype, setPrototype] = createSignal('Hello');
  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex h-screen" id="container">
        {/* Left Panel: History of User Prompts */}
        <section id="leftPanel" class="flex w-1/2 flex-col bg-gray-700">
          <Prompts />
          <Input setPrototype={setPrototype} />
        </section>

        <div
          id="divider"
          class="w-3 cursor-col-resize bg-gray-700 hover:bg-slate-400"
        >
          <div class="mx-auto h-full w-0.5 border border-gray-500"></div>
        </div>

        {/* Right Panel: Result of Last UI Generation */}
        <section id="rightPanel" class="w-1/2 bg-gray-700 p-8">
          <div id="uiResult" class="rounded bg-white p-4 text-black">
            <Preview prototype={prototype} />
          </div>
        </section>
      </div>
    </QueryClientProvider>
  );
}
