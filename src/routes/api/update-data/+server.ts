import type { RequestHandler } from '@sveltejs/kit';

export const POST = (() => {
	try {
		return new Response('data updated', { status: 200 });
	} catch (error: any) {
		console.log('Error while updating data: ', error?.message);
		return new Response('Error while updating data: ' + error?.message, { status: 401 });
	}
}) satisfies RequestHandler;
