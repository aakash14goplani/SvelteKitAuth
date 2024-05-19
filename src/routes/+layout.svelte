<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';

	beforeNavigate(({ to, cancel }) => {
		if (to?.url) {
			const targetUrl = to.url;
			const targetUrlPath = targetUrl.pathname;
			if (!targetUrlPath.startsWith('/hello')) {
				cancel();
				const newUrl = targetUrl.origin + base + targetUrlPath;
				goto(newUrl);
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
