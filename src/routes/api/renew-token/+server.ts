import type { RequestHandler } from '@sveltejs/kit';
import { CLIENT_ID, CLIENT_SECRET, ISSUER, API_IDENTIFIER } from '$env/static/private';
import { isEmpty } from 'lodash-es';

export const POST = (async ({ fetch, locals }) => {
  const session = await locals.auth();
  const user = session?.user;

  if (!isEmpty(user) && !isEmpty(session)) {
    try {
      const request = await fetch(`${ISSUER}oauth/token`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          audience: API_IDENTIFIER
        })
      });
      const response = {
        access_token: 'new-access-tokne-returned-from-api',
        expires_in: 1234567890,
        token_type: 'Bearer'
      };
      // await request.json();
      console.log(`Response from API: ${JSON.stringify(response)}`);
      return new Response(JSON.stringify(response), { status: 200 });
    } catch (error: any) {
      console.log(`Error while updating token data: ${error?.message}. Reusing existing tokens!`);
      return new Response(JSON.stringify({
        access_token: user.access_token,
        expires_in: user.expires_in,
        token_type: 'Bearer'
      }), { status: 200 });
    }
  } else {
    return new Response(JSON.stringify({
      message: 'User is not authorized to rotate access-token'
    }), { status: 401 });
  }
}) satisfies RequestHandler;
