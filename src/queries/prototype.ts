import { createMutation } from '@tanstack/solid-query';
import ky from 'ky';

export function makePrototypeMutation() {
  return createMutation(() => ({
    mutationFn: ({ prompt, aiKey }: { prompt: string; aiKey: string }) => {
      return ky.post('/api/prototype', { json: { prompt, aiKey } }).json();
    },
  }));
}
