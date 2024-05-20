import type { RequestHandler } from "@sveltejs/kit";
import { isEmpty } from "lodash-es";

export const GET = (async (event) => {
  let returnValue = { status: 200 };
  try {
    const session = await event.locals.auth();
    const user = session?.user;
    const isUserLoggedIn = !isEmpty(session) && !isEmpty(user);
    returnValue = isUserLoggedIn ? { status: 200 } : { status: 401 };
  } catch (ex: any) {
    console.log(`Exception occured while quering user session: ${ex?.message}`);
    returnValue = { status: 401 };
  }

  return new Response(JSON.stringify(returnValue), { status: 200 });
}) satisfies RequestHandler;