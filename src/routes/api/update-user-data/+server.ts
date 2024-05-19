import type { RequestHandler } from '@sveltejs/kit';

export const POST = (() => {
	try {
		return new Response('User data updated', { status: 200 });
	} catch (error: any) {
		console.log('Error while updating user data: ', error?.message);
		return new Response('Error while updating user data: ' + error?.message, { status: 200 });
	}
}) satisfies RequestHandler;
