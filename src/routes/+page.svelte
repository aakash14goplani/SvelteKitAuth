<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { signIn, signOut } from '@auth/sveltekit/client';

	function logout() {
		signOut();
	}

	async function updateUserData() {
		await fetch(base + '/api/update-user-data?query=update-user-data', {
			method: 'POST'
		});
	}

	function printUserData() {
		console.log('User Data: ', $page.data.session?.user);
	}
</script>

<div class="content">
	<h2>Client Side Flow</h2>

	<p>
		This page deals with client side sign-in and sign-out. For server-side, redirect to <a
			href={base + '/login'}>/login</a
		>.
	</p>

	<p>
		{#if $page.data.session?.user && Object.keys($page.data?.session?.user || {}).length}
			<div class="signedin">
				<span>Signed in as</span>
				<strong>Email: {$page.data.session.user.email}</strong>
				<strong>Name: {$page.data.session.user.name}</strong>
				<div class="buttons">
					<button on:click={logout} class="button">Sign out</button>
					<button on:click={updateUserData} class="button">Update user data v1</button>
					<button on:click={printUserData} class="button">Print user data</button>
				</div>
				<p>
					Since you are logged-in, you can access <a href={base + '/about-us'}>protected routes</a>
				</p>
			</div>
		{:else}
			<span class="notSignedInText">You are not signed in</span>
			<button
				on:click={() => signIn('auth0', { redirect: false }, { scope: 'api openid profile email' })}
			>
				<span>Sign In with Auth0</span>
			</button>
			<p>
				Since you are logged-out, you cannot access <a href={base + '/about-us'}>protected routes</a
				>
			</p>
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
