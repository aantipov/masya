import { createMemo } from 'solid-js';

interface PreviewProps {
  prototype: () => string;
}

export default function Preview({ prototype }: PreviewProps) {
  const fullPrototype = createMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
      <title>Hello</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script> 
      </head>
      <body>
      <h1 class="font-bold text-2xl">Default contents</h1>
      <div>${prototype()}</div>
      </body>
    
    `,
  );

  return (
    <iframe
      srcdoc={fullPrototype()}
      title="Preview"
      sandbox="allow-scripts"
      width="100%"
      height="100%"
    />
  );
}
