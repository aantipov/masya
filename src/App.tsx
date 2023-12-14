import 'solid-devtools/setup';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import AppContent from './AppContent';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
