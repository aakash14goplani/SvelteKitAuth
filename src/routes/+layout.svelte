<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';

	beforeNavigate(async ({ to, cancel }) => {
		if (to?.url && to.url.pathname !== '/') {
			// check user session on every navigation
			const request = await fetch(`${window.location.origin}/api/get-session-status`);
			const response = await request.json();
			const publicURLs = ['/ssr-login', '/ssr-logout', '/public', '/'];
			if (response.status !== 200 && !publicURLs.includes(window.location.pathname)) {
				// user is not-logged in, redirect to sign-in screen
				cancel();
				goto(`/`);
			}
		}

		return true;
	});
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
