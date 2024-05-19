import { base } from '$app/paths';
import { sequence } from '@sveltejs/kit/hooks';
import { getAuthConfig } from '$lib/server/auth';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';

const userSessionInterceptor = (async ({ event, resolve }) => {
	const session = await event.locals.auth();
	const isSessionTimedOut = new Date(session?.expires || '') <= new Date();
	const isUserSessionUndefined = !session?.user;
	const isUrlExempted =
		event.url.pathname.includes('/public/') ||
		event.url.pathname.includes('/api') ||
		event.url.pathname === base ||
		event.url.pathname === base + '/';

	if (isSessionTimedOut || isUserSessionUndefined) {
		if (!isUrlExempted) {
			console.log('[server-hooks] Redirecting to home page against URL: ', event.url.href);
			redirect(302, base);
		}
	}

	return await resolve(event);
}) satisfies Handle;

export const handleError: HandleServerError = ({ error }) => {
	const message = 'Error caught in [server-hooks]: ' + (error as any)?.message;
	console.log(message, error);
	return { message };
};

export const handle = sequence(getAuthConfig, userSessionInterceptor);
