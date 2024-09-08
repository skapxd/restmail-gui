import { getInbox } from "#/src/actions/get-inbox";

export const prerender = false;

export const GET = async (props: { request: Request }): Promise<Response> => {
  const { request } = props;
  const email = new URL(request.url).searchParams.get("email");

  if (!email) {
    return new Response("Email not provided", { status: 400 });
  }

  const response = await getInbox(email);

  return new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });
};
