import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals }) => {
	try {
		const session = await locals.auth();
		if (session && !!session?.user?.access_token) {
			const formData = new URLSearchParams();
			formData.append('redirect', 'false');

			await fetch('/auth/signout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: formData.toString()
			});
		}
	} catch (e: any) {
		console.log('Exception thrown while auto-sign-out: ', e);
	}
}) satisfies PageServerLoad;
