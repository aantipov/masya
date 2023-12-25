import 'solid-devtools/setup';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { useClerk } from '@/sharedState';
import AppContent from './AppContent';
import { Show } from 'solid-js';

const queryClient = new QueryClient();

interface AppProps {
  clerkPKey: string;
}

export default function App({ clerkPKey }: AppProps) {
  // Init Shared State with Clerk instance
  const { getClerkLoaded } = useClerk(clerkPKey);

  return (
    <QueryClientProvider client={queryClient}>
      <Show when={getClerkLoaded()}>
        <AppContent />
      </Show>
    </QueryClientProvider>
  );
}
