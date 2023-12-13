import 'solid-devtools/setup';
import { createSignal } from 'solid-js';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import Input from './components/Input';
import History from './components/History';
import Preview from './components/Preview';

const queryClient = new QueryClient();

export default function App() {
  const [prototype, setPrototype] = createSignal('');
  const [isError, setIsError] = createSignal(false);
  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex h-screen" id="container">
        {/* Left Panel: History of User Prompts */}
        <section id="leftPanel" class="flex w-1/3 flex-col bg-gray-700">
          <History />
          <Input setPrototype={setPrototype} setIsError={setIsError} />
        </section>

        <div
          id="divider"
          class="w-3 cursor-col-resize bg-gray-700 hover:bg-slate-400"
        >
          <div class="mx-auto h-full w-0.5 border border-gray-500"></div>
        </div>

        {/* Right Panel: Result of Last UI Generation */}
        <section id="rightPanel" class="w-2/3 bg-gray-700 p-12">
          <div id="uiResult" class="h-full rounded bg-white p-12 text-black">
            <Preview prototype={prototype} isError={isError} />
          </div>
        </section>
      </div>
    </QueryClientProvider>
  );
}
