<svelte:head>
	<title>Protected Route</title>
</svelte:head>

<div class="content">
	<h1>Protected Page</h1>

	<p>This is a protected page. Back to <a href="/">Home Page</a> or visit a <a href="/public">public route</a></p>
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
