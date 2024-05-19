/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly CLIENT_ID: string;
	readonly CLIENT_SECRET: string;
	readonly ISSUER: string;
	readonly WELL_KNOWN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
