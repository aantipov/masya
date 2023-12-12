import { createMutation } from '@tanstack/solid-query';
import OpenAI from 'openai';
import ky from 'ky';

export function makePrototypeMutation() {
  return createMutation(() => ({
    mutationFn: async ({
      prompt,
      aiKey,
    }: {
      prompt: string;
      aiKey: string;
    }) => {
      const resp = await ky
        .post('/api/prototype', { json: { prompt, aiKey } })
        .json<OpenAI.ChatCompletionMessage>();
      const contentStr = resp.content as string;
      const content = JSON.parse(contentStr);
      return content.html;
    },
  }));
}
