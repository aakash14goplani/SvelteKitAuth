import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session {
		user: DefaultSession['user'] & Partial<IUser>;
	}
}

interface IUser {
	name: string;
	email: string;
	image: string;
	picture: string;
	sub: string;
	access_token: string;
	id_token: string;
	scope: string;
	expires_in: number;
	token_type: string;
	expires_at: number;
	provider: string;
	type: string;
	providerAccountId: string;
	nickname: string;
	updated_at: string;
	email_verified: boolean;
	iss: string;
	aud: string;
	iat: number;
	exp: number;
	sid: string;
	jti: string;
	library: string;
}
