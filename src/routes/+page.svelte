<script>
	import Memory from '../components/Memory.svelte';
</script>

<div class="game-container pixelated">
	<Memory />
</div>

<style lang="scss">
	@font-face {
		font-family: 'Pixel';
		src: url('/font/pixel.ttf') format('truetype');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	:global(.pixelated) {
		image-rendering: optimizeSpeed; /* STOP SMOOTHING, GIVE ME SPEED  */
		image-rendering: -moz-crisp-edges; /* Firefox                        */
		image-rendering: -o-crisp-edges; /* Opera                          */
		image-rendering: pixelated; /* Universal support since 2021   */
		-ms-interpolation-mode: nearest-neighbor; /* IE8+                           */
	}

	:global(body),
	:global(html) {
		width: 100%;
		height: 100%;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.game-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		background: url('/castle-bg.webp') no-repeat center;
		background-size: cover;
	}
</style>
