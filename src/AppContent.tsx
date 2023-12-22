import 'solid-devtools/setup';
import { makePrototypeMutation } from '@/queries/prototype';
import Input from './components/Input';
import Preview from './components/Preview';
import { createSignal } from 'solid-js';

export default function AppContent() {
  const prototypeM = makePrototypeMutation();
  const [prototypeStream, setPrototypeStream] = createSignal('');

  return (
    <div class="flex flex-col overflow-hidden py-4">
      <section
        style="height: calc(100vh - 200px)"
        class="group/toolbar container relative mx-auto grow-0 overflow-scroll rounded bg-gray-700 p-6 text-black"
      >
        <Preview prototypeM={prototypeM} prototypeStream={prototypeStream} />
      </section>

      <div class="relative h-32">
        <div class="absolute bottom-8 left-1/2 mx-auto max-w-3xl -translate-x-1/2 transform">
          <Input
            prototypeM={prototypeM}
            setPrototypeStream={setPrototypeStream}
          />
        </div>
      </div>
    </div>
  );
}
