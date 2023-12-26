import 'solid-devtools/setup';
import Input from './components/Input';
import Preview from './components/Preview';
import { useClerk, useUserAPIKey } from '@/sharedState';
import { Show } from 'solid-js';
import AuthModal from './components/AuthModal';
import Notify from './components/Notify';

export default function AppContent() {
  const { getClerk } = useClerk();
  const [userAPIKey] = useUserAPIKey();

  // Show Auth Modal if no user API key is set or user is not authenticated
  const showAuthModal = () => !userAPIKey() && !getClerk()!.user;

  return (
    <div>
      <Notify />

      <Show when={showAuthModal()}>
        <AuthModal />
      </Show>

      <div class="flex flex-col overflow-hidden py-4">
        <section
          style="height: calc(100vh - 200px)"
          class="group/toolbar container relative mx-auto grow-0 overflow-scroll rounded bg-gray-700 p-6 text-black"
        >
          <Preview />
        </section>

        <div class="relative h-32">
          <div class="absolute bottom-8 left-1/2 mx-auto max-w-3xl -translate-x-1/2 transform">
            <Input />
          </div>
        </div>
      </div>
    </div>
  );
}
