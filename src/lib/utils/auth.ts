import { dev } from '$app/environment';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import { VERCEL_SECRET, CLIENT_ID, CLIENT_SECRET, ISSUER, WELL_KNOWN } from '$env/static/private';

import { isEmpty } from 'lodash-es';


export const { handle: getAuthConfig } = SvelteKitAuth(async (event) => {
	const useSecureCookies = !dev;

	const config: SvelteKitAuthConfig = {
		providers: [
			{
				id: 'auth1',
				name: 'custom-oauth-provider',
				type: 'oidc',
				client: {
					token_endpoint_auth_method: 'client_secret_post'
				},
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				issuer: ISSUER,
				wellKnown: WELL_KNOWN,
				checks: ['pkce'],
				authorization: {
					url: `https://sveltekit-auth-identity-server.vercel.app/authorize?source_url=${event.url.origin}`, // `http://localhost:4200/authorize?source_url=${event.url.origin}`, -> identity server running on port 4200 and main app running on port 4201
					params: {
						scope: 'openid name email profile',
						redirect_uri: `https://sveltekit-auth-identity-server.vercel.app/auth/callback/auth1`, // `http://localhost:4200/auth/callback/auth1`
					}
				},
				token: `${ISSUER}oauth/token`,
				userinfo: `${ISSUER}userinfo`,
				redirectProxyUrl: 'https://sveltekit-auth-identity-server.vercel.app/auth' // 'http://localhost:4200/auth'
			}
		],
		debug: true,
		basePath: '/auth',
		secret: VERCEL_SECRET,
		session: {
			strategy: 'jwt',
			maxAge: 3600 // set expiry in 60 minutes
		},
		cookies: {
			callbackUrl: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.callback-url`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies,
					// domain: '.myapp.com'
				}
			},
			pkceCodeVerifier: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.pkce.code_verifier`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies,
					// domain: '.myapp.com'
				}
			},
			sessionToken: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.session-token`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies,
					// domain: '.myapp.com'
				}
			},
			state: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.state`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies,
					// domain: '.myapp.com'
				}
			}
		},
		trustHost: true,
		callbacks: {
			async jwt({ token, account, profile }) {
				if (!isEmpty(account)) {
					token = { ...token, ...account };
				}
				if (!isEmpty(profile)) {
					token = { ...token, ...(profile as any) };
				}
				return token;
			},
			async session({ session, token }) {
				if (session.user) {
					if (token?.access_token) {
						session.user = { ...session.user, ...token } as any;
					}
				}
				return session;
			}
		},
		logger: {
			error: async (error: any) => {
				let errorMessage = '';
				try {
					const _error = JSON.stringify(error);
					errorMessage = _error;
				} catch (e: any) {
					errorMessage = e?.message;
				}
				console.log('ERROR in AUTH: ', errorMessage);
			}
		},
		pages: {
			error: '/auth/server-auth-error'
		}
	};

	return config;
});
