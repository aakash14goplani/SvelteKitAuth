import type { RequestHandler } from '@sveltejs/kit';

export const GET = (async ({ locals }) => {
	const session = await locals?.auth();
	return new Response(JSON.stringify(session), { status: 200 });
}) satisfies RequestHandler;
