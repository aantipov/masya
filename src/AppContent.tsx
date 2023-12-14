import 'solid-devtools/setup';
import { makePrototypeMutation } from '@/queries/prototype';
import Input from './components/Input';
import History from './components/History';
import Preview from './components/Preview';

export default function AppContent() {
  const prototypeM = makePrototypeMutation();

  return (
    <div class="flex h-screen" id="container">
      {/* Left Panel: History of User Prompts */}
      <section id="leftPanel" class="flex w-1/3 flex-col bg-gray-700">
        <History />
        <Input prototypeM={prototypeM} />
      </section>

      <div
        id="divider"
        class="w-3 cursor-col-resize bg-gray-700 hover:bg-slate-400"
      >
        <div class="mx-auto h-full w-0.5 border border-gray-500"></div>
      </div>

      {/* Right Panel: Result of Last UI Generation */}
      <section id="rightPanel" class="w-2/3 bg-gray-700 p-12">
        <div
          id="uiResult"
          class="group/toolbar relative h-full rounded bg-white p-6 text-black"
        >
          <Preview prototypeM={prototypeM} />
        </div>
      </section>
    </div>
  );
}
