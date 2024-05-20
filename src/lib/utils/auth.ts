import { dev } from '$app/environment';
import Auth0Provider from "@auth/core/providers/auth0";
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import { VERCEL_SECRET, CLIENT_ID, CLIENT_SECRET, ISSUER, WELL_KNOWN } from '$env/static/private';

import { difference, isEmpty } from 'lodash-es';


export const { handle: getAuthConfig } = SvelteKitAuth(async (event) => {
	const useSecureCookies = !dev;

	const config: SvelteKitAuthConfig = {
		providers: [
			Auth0Provider({
				id: 'auth0',
				name: 'built-in-oauth-provider',
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				issuer: ISSUER
			}),
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
					url: `${ISSUER}authorize`, // 'http://localhost:4200/authorize
					params: {
						scope: 'openid name email profile',
						redirect_uri: `${ISSUER}auth/callback/auth1`
					}
				},
				token: `${ISSUER}oauth/token`,
				userinfo: `${ISSUER}userinfo`
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
					secure: useSecureCookies
				}
			},
			csrfToken: {
				name: `${useSecureCookies ? '__Host-' : ''}authjs.csrf-token`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies
				}
			},
			pkceCodeVerifier: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.pkce.code_verifier`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies
				}
			},
			sessionToken: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.session-token`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies
				}
			},
			state: {
				name: `${useSecureCookies ? '__Secure-' : ''}authjs.state`,
				options: {
					httpOnly: true,
					sameSite: useSecureCookies ? 'none' : 'lax',
					path: '/',
					secure: useSecureCookies
				}
			}
		},
		trustHost: true,
		callbacks: {
			async jwt({ token, account, profile }) {
				/**
				 * This callback triggers multiple times. For the very first time,
				 * token -> { name, email, picture, sub }
				 * account -> { all_tokens }
				 * profile -> { all_user_details_and_custom-attributes }
				 * trigger -> { signin, signut, update }
				 * For second and successive times,
				 * token -> { name, email, picture, sub, iat, exp, jti }
				 * account -> undefined
				 * profile -> undefined
				 * trigger -> undefined
				 */
				// store init values that must be passed to session cb, if this line is skipped then
				// { name, email, picture, sub, iat, exp, jti } will always be undefined in session cb
				try {
					if (!isEmpty(account)) {
						token = { ...token, ...account };
					}
					if (!isEmpty(profile)) {
						token = { ...token, ...(profile as any) };
					}
					
					// update user data on request
					const userQuery = event.request.headers.get('query') || event.url.searchParams.get('query');
					
					// refresh token post 30 minutes
					if (
						token &&
						(isTokenRefreshRequired(token.token_expires_in as string) || userQuery === 'update-token-data')
					) {
						const tokenRequest = await event.fetch(
							event.url.origin + '/api/renew-token',
							{
								method: 'POST'
							}
						);
						const updatedToken = await tokenRequest.json();
						if (updatedToken.access_token) {
							token = {
								...token,
								...updatedToken
							};
						}
					}

					if (userQuery === 'update-user-data') {
						try {
							const clonedRequest = event.request.clone();
							const clonedBody = clonedRequest.body;
							const response = await new Response(clonedBody);
							const body = await response.json();
							if (!isEmpty(body)) {
								token = {
									...token,
									...body
								};
							}
						} catch (ex: any) {
							console.log('Unable to update user data for url', ex?.message);
						}
					}
				} catch (e: any) {
					console.log('ERROR in AUTH JWT CALLBACK: ', e?.message);
				}
				return token;
			},
			async session({ session, token }) {
				try {
					// This callback triggers multiple times
					if (session.user) {
						if (token?.access_token) {
							session.user = { ...session.user, ...token } as any;
						}
					}
				} catch (e: any) {
					console.log('ERROR in AUTH SESSION CALLBACK: ', e?.message);
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

				/**
				 * Most recurring errors:
				 * 1. ERROR in AUTH:  {"name":"CallbackRouteError","type":"CallbackRouteError","kind":"error"}
				 * error { error: 'invalid_grant', error_description: 'invalid code verifier' }
				 * This error occurs when the user cannot finish login.
				 *
				 * 2. ERROR in AUTH:  {"name":"InvalidCheck","type":"InvalidCheck","kind":"error"}
				 * Thrown when a PKCE, state or nonce OAuth check could not be performed.
				 * This could happen if the OAuth provider is configured incorrectly or if the browser is blocking cookies.
				 *
				 * Solution: Clear code-challenge and code-verifier cookies and try login again
				 */
			}
		},
		events: {
			async signOut(message: any) {
				console.log(message);
				// cleanup activity post logout
			}
		},
		pages: {
			error: '/auth/server-auth-error',
			signIn: '/auth/sign-in',
			signOut: '/auth/sign-out'
		}
	};

	/* if (isPrUrl(event)) {
		(config.providers[0] as any).checks = ['pkce', 'state'];
		config.redirectProxyUrl = getEnvSpecificURL(
			ENVIRONMENT.AUTH_REDIRECT_PROXY_URL
		);
	} */

	return config;
});

function isTokenRefreshRequired(issued_at: string) {
	return +difference([new Date(+issued_at), new Date(), 'minutes']) > 29;
}