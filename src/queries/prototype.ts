import { createMutation } from '@tanstack/solid-query';
import ky from 'ky';

export function makePrototypeMutation() {
  return createMutation(() => ({
    mutationFn: (inp: string) => {
      return ky.post('/api/prototype').json();
    },
  }));
}
