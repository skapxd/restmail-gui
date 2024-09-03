export { renderers } from '../renderers.mjs';

const prerender = false;
async function GET({
  request
}) {
  const email = new URL(request.url).searchParams.get("email");
  const response = await fetch(`https://restmail.net/mail/${email}`).then((res) => {
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  }).then((res) => {
    return res.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  return new Response(JSON.stringify(response));
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
