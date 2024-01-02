import OpenAI from 'openai';
import { parse } from 'cookie';
import { verifyToken } from '@clerk/backend';

export const onRequestOptions: PagesFunction = async ({ request }) => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost: PagesFunction<CFEnvT> = async ({
  request,
  env,
}) => {
  // @ts-ignore
  const { prompt, aiKey: userApiKey, prototype } = await request.json();

  if (!prompt) {
    return new Response('Invalid request', { status: 400 });
  }

  let apiKey;
  try {
    apiKey = await getApiKey(userApiKey, request, env);
  } catch (error) {
    console.log('Error:', error);
    return new Response('Invalid API key', { status: 401 });
  }

  try {
    return await handleRequest(prompt, apiKey, prototype);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

async function getApiKey(
  userApiKey: string,
  request: Request,
  env: CFEnvT,
): Promise<string> {
  const TOKEN_COOKIE_NAME = '__session';
  const cookie = parse(request.headers.get('Cookie') || '');
  const jwtToken = cookie[TOKEN_COOKIE_NAME];

  if (!userApiKey && !jwtToken) {
    throw new Error('No API key');
  }

  if (userApiKey) {
    return userApiKey;
  }

  // Verify jwt token
  let res;
  try {
    res = await verifyToken(jwtToken!, {
      issuer: null,
      secretKey: env.CLERK_SECRET_KEY,
    });
  } catch (error) {
    throw new Error('Error verifying token');
  }

  return env.OPENAI_API_KEY;
}

async function handleRequest(
  prompt: string,
  apiKey: string,
  prototype?: string,
) {
  const openai = new OpenAI({ apiKey });
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: !!prototype
      ? getFollowUpMessages(prompt, prototype)
      : getMessages(prompt),
    stream: true,
    temperature: 0.1,
    max_tokens: 1450,
  });

  let { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const textEncoder = new TextEncoder();

  // loop over the data as it is streamed from OpenAI and write it using our writeable
  (async () => {
    try {
      for await (const chunk of stream) {
        // every chunk has the following form:
        /* chunk {
          id: 'chatcmpl-8VuadGcFgVmrLSSBeIywZkM2n1zVm',
          object: 'chat.completion.chunk',
          created: 1702616391,
          model: 'gpt-3.5-turbo-0613',
          system_fingerprint: null,
          choices: [ { index: 0, delta: { content: 'div }, finish_reason: null } ]
        }*/

        writer
          .write(textEncoder.encode(chunk.choices[0]?.delta?.content || ''))
          .catch((error) => {
            console.error('WRITE ERROR', error);
          });
      }
    } catch (error) {
      console.error('Stream reading error:', error);
      writer.abort('Stream reading error');
    }
    writer.close();
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function getMessages(prompt: string): OpenAI.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `
You are an UI generator designed to answer with HTML markup (styled using Tailwind classes) according to user's description.
Your response must adhere to these guidelines:
1. Format: HTML.
2. Use existing knowledge.

Follow user instructions to generate a prototype.

Make sure the generated UI meets the following requirements:
- modern, responsive, and accessible.
- includes only the contents of the <body> tag. Doesn't include the <head> tag or the whole html page.
- wrapped into a container with a proper background color that contains additional Tailwind classes: "container p-8 mx-auto".
- has a proper max-width when needed
`,
    },
    {
      role: 'user',
      content: 'A simple feedback form',
    },
    {
      role: 'assistant',
      content: `<button class="inline-flex items-center justify-center text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md">
      Click me
    </button>`,
    },
    {
      role: 'user',
      content: String(prompt),
    },
  ];
}

function getFollowUpMessages(
  prompt: string,
  prototype?: string,
): OpenAI.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `
You are an AI prototype generator designed to answer with HTML markup (styled using Tailwind classes) according to user's description.

Your response must adhere to these guidelines:
1. Format: HTML.
2. Use existing knowledge.

You are given an existing prototype to improve upon:
"""
${String(prototype)}
"""

Follow user instructions to improve the prototype.

Important: Do not include any additional information in your response. Your response should only include the updated HTML markup.
`,
    },
    {
      role: 'user',
      content: String(prompt),
    },
  ];
}
