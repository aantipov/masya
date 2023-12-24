import 'solid-devtools/setup';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { setClerk, getClerkLoaded, setClerkLoaded } from '@/sharedState';
import Clerk from '@clerk/clerk-js';
import { shadesOfPurple } from '@clerk/themes';
import AppContent from './AppContent';
import { Show, createEffect } from 'solid-js';

const queryClient = new QueryClient();

interface AppProps {
  clerkPKey: string;
}

export default function App({ clerkPKey }: AppProps) {
  // Init Shared State with Clerk instance
  createEffect(() => {
    const clerkInstance = new Clerk(clerkPKey);
    setClerk(clerkInstance);
    async function loadClerk() {
      await clerkInstance.load({
        appearance: {
          baseTheme: shadesOfPurple,
          layout: {
            showOptionalFields: true,
            socialButtonsPlacement: 'bottom',
            socialButtonsVariant: 'iconButton',
          },
        },
      });
      setClerkLoaded(true);
    }
    loadClerk();
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Show when={getClerkLoaded()}>
        <AppContent />
      </Show>
    </QueryClientProvider>
  );
}
