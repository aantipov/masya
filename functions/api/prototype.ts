import OpenAI from 'openai';

export const onRequestOptions: PagesFunction = async ({ request }) => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  // @ts-ignore
  const { prompt, aiKey: apiKey, prototype } = await request.json();

  if (!apiKey || !prompt) {
    return new Response('Invalid request', { status: 400 });
  }

  try {
    return await handleRequest(prompt, apiKey, prototype);
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

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
You are an AI prototype generator designed to answer with HTML markup (styled using Tailwind classes) according to user's description.
Your response must adhere to these guidelines:
1. Format: HTML.
2. Use existing knowledge.
`,
    },
    {
      role: 'user',
      content: 'A simple feedback form',
    },
    {
      role: 'assistant',
      content:
        '<div class="border text-card-foreground max-w-md mx-auto bg-white shadow-lg rounded-lg md:max-w-5xl" data-v0-t="card"><div class="flex flex-col space-y-1.5 p-6"><h3 class="tracking-tight text-2xl font-bold text-center">Feedback Form</h3><p class="text-sm text-muted-foreground text-center">\n  We value your feedback. Please let us know how we can improve.\n</p></div><div class="p-6"><div class="space-y-4"><div class="space-y-2"><label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="feedback">Your Feedback</label><textarea class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]" id="feedback" placeholder="Write your feedback here"></textarea></div><button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-blue-500 hover:bg-blue-700 text-white">Submit Feedback</button></div></div></div>',
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
