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
      <section class="group/toolbar container relative mx-auto grow overflow-scroll rounded bg-gray-700 p-6 text-black">
        <Preview prototypeM={prototypeM} prototypeStream={prototypeStream} />
      </section>
      <div class="mx-auto max-w-3xl">
        <Input
          prototypeM={prototypeM}
          setPrototypeStream={setPrototypeStream}
        />
      </div>
    </div>
  );
}
