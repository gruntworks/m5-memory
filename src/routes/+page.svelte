<script lang="ts">
	import Memory from '../components/Memory.svelte';
	import { onDestroy } from 'svelte';

	let windowWidth: number;
	let layout: 'desktop' | 'mobile' = 'mobile';

	if (!import.meta.env.SSR) {
		const resizeHandler = () => {
			windowWidth = window.innerWidth;
		};

		window.addEventListener('resize', resizeHandler);
		resizeHandler();

		onDestroy(() => {
			window.removeEventListener('resize', resizeHandler);
		});
	}

	$: if (windowWidth < 768) {
		layout = 'mobile';
	} else {
		layout = 'desktop';
	}
</script>

<div class="game-container pixelated">
	<Memory mobileLayout={layout === 'mobile'} />
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
		justify-content: center;
		background-size: cover;

		background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.5)),
			url('/castle-bg.webp');
		background-blend-mode: overlay;
		background-repeat: no-repeat;
	}
</style>
