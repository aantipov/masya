import { createMutation, useQueryClient } from '@tanstack/solid-query';
import ky from 'ky';
import type { Setter } from 'solid-js';

export function makePrototypeMutation() {
  return createMutation(() => ({
    mutationFn: async ({
      prompt,
      aiKey,
      setPrototypeStream,
    }: {
      prompt: string;
      aiKey: string;
      setPrototypeStream: Setter<string>;
    }) => {
      setPrototypeStream('');
      const response = await ky.post('/api/prototype', {
        json: { prompt, aiKey },
        timeout: false,
      });
      const reader = response.body!.getReader();
      const textDecoder = new TextDecoder();
      let result = '';
      async function read() {
        let done = false;
        let value;

        while (!done) {
          try {
            ({ done, value } = await reader.read());
            if (!done) {
              const chunk = textDecoder.decode(value);
              result += chunk;
              setPrototypeStream(result || '');
            }
          } catch (error) {
            console.error('Stream reading error:', error);
            break;
          }
        }
        console.log('Stream complete');
      }

      // Start reading the stream
      await read();

      setPrototypeStream(result);

      return result;
    },
  }));
}
