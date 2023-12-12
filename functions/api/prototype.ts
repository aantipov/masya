export const onRequestPost: PagesFunction = async ({ request }) => {
  //   return new Response('Invalid token', {
  //     status: 401,
  //     headers: [],
  //   });
  const body = await request.json();
  return new Response(
    JSON.stringify({ prompt: body.prompt, aiKey: body.aiKey.slice(2, 6) }),
  );
};
