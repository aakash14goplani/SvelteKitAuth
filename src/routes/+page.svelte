<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	$: isUserLoggedIn = browser && $page.data.session?.user && Object.keys($page.data?.session?.user || {}).length > 0
</script>

<svelte:head>
  <title>Home Page</title>
</svelte:head>

<div class="content">
	{#if !isUserLoggedIn}
		<div class="content__sign-in-options">
			<div class="content__sign-in-options__server">
				<strong>Server Side Authentication using API</strong>
				<p>
					This page deals with client side sign-in and sign-out. For server-side, redirect to <a
						href={'/ssr-login'}>/login</a
					>.
				</p>
			</div>
			<div class="content__sign-in-options__server">
				<p>Since you're not logged-in, you can still browse <a href="/public">public routes</a></p>
				<p>However, you won't be able to access <a href="/protected">protected routes</a> until you login</p>
			</div>
		</div>
		{:else}
			<div class="signedin">
				<span>Signed in as</span>
				<strong>Email: {$page.data.session?.user?.email}</strong>
				<strong>Name: {$page.data.session?.user?.name}</strong>
				<p>
					Since you are logged-in, you can access <a href={'/protected'}>protected routes</a> as well as <a href="/public">public routes</a>
				</p>
				<p>For server-side logout, redirect to <a href='/ssr-logout'>/logout</a></p>
			</div>
	{/if}
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.6rem;
		line-height: 2rem;
		padding: 1rem;

		&__sign-in-options {
			display: flex;
			flex-direction: column;

			div {
				padding: 1rem 0;
			}
		}

		.signedin {
			display: flex;
			flex-direction: column;
			align-items: center;
			line-height: 2rem;
		}
	}
</style>
