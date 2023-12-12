import OpenAI from 'openai';

export const onRequestPost: PagesFunction = async ({ request }) => {
  // @ts-ignore
  const { prompt, aiKey: apiKey } = await request.json();
  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: getMessages(prompt),
    temperature: 0.1,
    max_tokens: 450,
  });

  return new Response(JSON.stringify(response.choices[0].message));
};

function getMessages(prompt: string): OpenAI.ChatCompletionMessageParam[] {
  return [
    {
      role: 'system',
      content: `
You are an AI prototype generator designed to answer with HTML markup (styled using Tailwind classes) according to user's description.
Your response must adhere to these guidelines:
1. Format: JSON object with "html" key.
2. Use existing knowledge.

Example of user message: "A simple feedback form".
Example of your response: { "html": "<div class=\"border text-card-foreground max-w-md mx-auto bg-white shadow-lg rounded-lg md:max-w-5xl\" data-v0-t=\"card\"><div class=\"flex flex-col space-y-1.5 p-6\"><h3 class=\"tracking-tight text-2xl font-bold text-center\">Feedback Form</h3><p class=\"text-sm text-muted-foreground text-center\">\n  We value your feedback. Please let us know how we can improve.\n</p></div><div class=\"p-6\"><div class=\"space-y-4\"><div class=\"space-y-2\"><label class=\"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70\" for=\"feedback\">Your Feedback</label><textarea class=\"flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]\" id=\"feedback\" placeholder=\"Write your feedback here\"></textarea></div><button class=\"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-blue-500 hover:bg-blue-700 text-white\">Submit Feedback</button></div></div></div>" }
`,
    },
    {
      role: 'user',
      content: String(prompt),
    },
  ];
}
