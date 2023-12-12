import 'solid-devtools/setup';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import Input from './components/Input';
import Prompts from './components/Prompts';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Prompts />
      <Input />
    </QueryClientProvider>
  );
}
