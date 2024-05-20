import type { RequestHandler } from '@sveltejs/kit';
import { isEmpty } from 'lodash-es';

export const POST = (async ({ locals }) => {
	const session = await locals.auth();
	const user = session?.user;

	if (!isEmpty(user) && !isEmpty(session)) {
		try {
			return new Response(JSON.stringify({
				data: user
			}), { status: 200 });
		} catch (error: any) {
			console.log('Error while updating user data: ', error?.message, '. Sending existing data');
			return new Response(JSON.stringify({ data: user }), { status: 200 });
		}
	} else {
		return new Response(JSON.stringify({ data: 'user is not authorized to update data' }), { status: 401 });
	}
}) satisfies RequestHandler;
