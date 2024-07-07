<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>SSR Login</title>
</svelte:head>

<div class="content">
	<h2>Server Side Flow - Login</h2>

	<p>
		This page deals with server side sign-in. As soon as you land on this page, you'll be
		authenticated.
	</p>

	<p>
		{#if $page.data.session?.user && Object.keys($page.data?.session?.user || {}).length}
			<div class="signedin">
				<span>Signed in as</span>
				<strong>Email: {$page.data.session.user.email}</strong>
				<strong>Name: {$page.data.session.user.name}</strong>
				<p>For server-side logout, redirect to <a href='/ssr-logout'>/logout</a></p>
				<p>
					Since you are logged-in, you can access <a href={'/protected'}>protected routes</a> as well as <a href="/public">public routes</a> or <a href="/">home page</a>
				</p>
			</div>
		{:else}
			<p>YOU'RE STILL NOT LOGGED IN!</p>
			<p>Go to <a href="/">home page</a></p>
		{/if}
	</p>
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.6rem;
		line-height: 2rem;
		padding: 2rem;

		.signedin {
			display: flex;
			flex-direction: column;
			align-items: center;
			line-height: 2rem;
		}
	}
</style>
