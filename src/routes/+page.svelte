<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { signIn, signOut } from '@auth/sveltekit/client';

	$: isUserLoggedIn = browser && $page.data.session?.user && Object.keys($page.data?.session?.user || {}).length > 0

	let userData = $page.data.session?.user?.fav_num || '';

	function logout() {
		signOut();
	}

	async function updateUserData() {
		const request = await fetch('/api/update-user-data?query=update-user-data', {
			method: 'POST',
			body: JSON.stringify({
				fav_num: `My favourite number is: ${Math.ceil(Math.random() * 100)}`
			})
		});
		const response = await request.json();
		userData = response?.data?.fav_num;
	}
</script>

<svelte:head>
  <title>Home Page</title>
</svelte:head>

<div class="content">
	{#if !isUserLoggedIn}
		<div class="content__sign-in-options">
			<div class="content__sign-in-options__client">
				<strong>Client Side Authentication</strong>
				<div>
					<span>
						Authentication using client-side handle <code>signIn</code>
					</span>
					<button
						on:click={() => signIn('auth0')}
					>
						<span>Sign In with Built-in Auth0 Provider</span>
					</button>
					<span> | </span>
					<button
						on:click={() => signIn('auth1')}
					>
						<span>Sign In with Custom Auth0 Provider</span>
					</button>
				</div>
			</div>
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
				<div class="buttons">
					<button on:click={logout} class="button">Sign out</button>
					<button on:click={updateUserData} class="button">Update user data</button>
				</div>
				{#if userData}
					<p>Updated user-data {userData}</p>
				{/if}
				<p>
					Since you are logged-in, you can access <a href={'/protected'}>protected routes</a> as well as <a href="/public">public routes</a>
				</p>
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

			.buttons {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin: 1rem auto;

				button {
					margin: 1rem;
				}
			}
		}
	}
</style>
