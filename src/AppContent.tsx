import 'solid-devtools/setup';
import getGroovy from '@/images/get-groovy.png';
import Input from './components/Input';
import { useClerk, useUserAPIKey, useMessages } from '@/sharedState';
import { For, Show, createEffect, on } from 'solid-js';
import AuthModal from './components/AuthModal';
import Notify from './components/Notify';
import Message from './components/Message';

export default function AppContent() {
  const { getClerk } = useClerk();
  const [userAPIKey] = useUserAPIKey();
  const { messages, msgStore } = useMessages();
  let scrollableRef: HTMLElement;

  createEffect(
    on(
      [() => messages.length, () => msgStore.response],
      () => {
        setTimeout(() => {
          scrollableRef.scrollTop = scrollableRef.scrollHeight;
        }, 100);
      },
      { defer: true },
    ),
  );

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
          ref={(el) => (scrollableRef = el)}
          style="height: calc(100vh - 200px)"
          class="container relative mx-auto grow-0 space-y-4 overflow-scroll rounded border border-slate-700 p-6 text-black shadow-xl"
        >
          <Show when={messages.length > 0}>
            <For each={messages}>{(item, i) => <Message item={item} />}</For>
          </Show>
          <Show when={messages.length === 0}>
            <div class="flex items-center justify-center">
              <img
                src={getGroovy.src}
                alt="Let's get groovy!"
                width={getGroovy.width}
                height={getGroovy.height}
              />
            </div>
          </Show>
        </section>

        <div class="relative h-32">
          <div class="absolute bottom-8 left-1/2 mx-auto max-w-3xl -translate-x-1/2 transform">
            <Input disabled={showAuthModal()} />
          </div>
        </div>
      </div>
    </div>
  );
}
