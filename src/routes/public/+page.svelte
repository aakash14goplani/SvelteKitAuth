<script lang="ts">
  import { page } from "$app/stores";
	import { browser } from "$app/environment";

  $: isUserLoggedIn = browser && $page.data.session?.user && Object.keys($page.data?.session?.user || {}).length > 0
</script>

<svelte:head>
  <title>Public Route</title>
</svelte:head>

<div class="content">
	<h1>Public Page</h1>

	<p>This is a public route. You don't need to be authenticated to view this route.</p>
  <p>Your current authentication status: <strong>{`${isUserLoggedIn ? 'Authenticated' : 'Unauthenticated'}`}</strong></p>
  {#if isUserLoggedIn}
    <p>Since you're logged-in, you can browse <a href="/protected">protected routes</a></p> or go back to <a href="/">home page</a>
  {:else}
    <p>To view protected routes, <a href="/">please login</a></p>
  {/if}
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.6rem;
		line-height: 2rem;
		padding: 2rem;
	}
</style>