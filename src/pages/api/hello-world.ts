export const prerender = false;

export async function GET() {
  const random = Math.random();
  return new Response(`Hello, world! ${random}`);
}
