export const onRequestPost = async () => {
  //   return new Response('Invalid token', {
  //     status: 401,
  //     headers: [],
  //   });
  return new Response(JSON.stringify({ message: 'Hello world' }));
};
