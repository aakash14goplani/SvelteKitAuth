import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals, url: _url }) => {
	let url = '';
	try {
		const session = await locals.auth();
		if (!session?.user) {
			const params = new URLSearchParams();
			params.append('scope', 'api openid profile email');

			const formData = new URLSearchParams();
			formData.append('redirect', 'true');
			formData.append('callbackUrl', `${_url.origin}/ssr-login`);

			const signInRequest = await fetch('/auth/signin/auth1? ' + params.toString(), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Auth-Return-Redirect': '1'
				},
				body: formData.toString()
			});
			const signInResponse = await new Response(signInRequest.body).json();

			if (signInResponse?.url) {
				url = signInResponse.url;
			}
		}
	} catch (e: any) {
		console.log('Exception thrown while auto-sign-in: ', e);
	}

	if (url) {
		console.log('Auto login user: ', url);
		throw redirect(302, url);
	}
}) satisfies PageServerLoad;
