import { createMutation } from '@tanstack/solid-query';
import { useMessages } from '@/sharedState';
import ky from 'ky';

export function makePrototypeMutation() {
  const { setResponse } = useMessages();
  return createMutation(() => ({
    mutationFn: async ({
      prompt,
      aiKey,
      prototype,
    }: {
      prompt: string;
      aiKey: string;
      prototype?: string;
    }) => {
      setResponse('');
      let response;
      let url = '/api/prototype';
      try {
        if (process.env.NODE_ENV === 'development') {
          url = 'https://masya.dev/api/prototype';
        }
        response = await ky.post(url, {
          json: { prompt, aiKey, prototype },
          timeout: false,
        });
      } catch (error) {
        console.error('Error:', error);
        throw new Error('Error fetching');
      }
      const reader = response.body!.getReader();
      const textDecoder = new TextDecoder();
      let result = '';
      let tag = '';
      async function read() {
        let done = false;
        let value;

        while (!done) {
          try {
            ({ done, value } = await reader.read());
            if (!done) {
              tag += textDecoder.decode(value);
              // if tag is not complete, continue
              if (!isValidHtmlString(tag)) continue;

              result += tag;
              tag = '';
              setResponse(result || '');
            }
          } catch (error) {
            console.error('Stream reading error:', error);
            break;
          }
        }
        console.log('Stream complete');
      }

      // Start reading the stream
      try {
        await read();
      } catch (error) {
        console.log('Stream reading error:', error);
      }

      setResponse(result, true);

      return result;
    },
  }));
}

function isValidHtmlString(str: string) {
  const regex = /<[^>]*$/;
  return !regex.test(str);
}
