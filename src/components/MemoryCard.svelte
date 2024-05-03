<script lang="ts">
	import { base } from '$app/paths';
	import { onDestroy } from 'svelte';
	export let item: string;
	export let onFlip: () => void | undefined;
	export let showItem = false;
	export let notDiscovered = false;

	let windowWidth;
	let cardSize: number;

	if (!import.meta.env.SSR) {
		const resizeHandler = () => {
			windowWidth = window.innerWidth;
			cardSize =
				windowWidth <= 768 ? Math.round(windowWidth * 0.17) : Math.round(windowWidth * 0.07);
		};

		window.addEventListener('resize', resizeHandler);
		resizeHandler();

		onDestroy(() => {
			window.removeEventListener('resize', resizeHandler);
		});
	}
</script>

<div
	class="card {!showItem && !notDiscovered ? 'pulse' : ''} {notDiscovered ? 'highlight-red' : ''}"
	on:click={() => {
		onFlip?.();
	}}
	on:keydown={undefined}
	role="button"
	tabindex="0"
	style="--random:{Math.random()}; width: {cardSize}px; height: {cardSize}px;"
>
	{#if showItem || notDiscovered}
		<img
			class="pixelated"
			src={`${base}/items/${item}.png`}
			alt={item}
			width={cardSize}
			height={cardSize}
		/>
	{/if}
</div>

<style lang="scss">
	.card {
		-webkit-tap-highlight-color: transparent;
		border-radius: 8px;
		cursor: pointer;
		user-select: none;
		display: grid;
		place-items: center;
		overflow: hidden;
		min-width: 80px;
		min-height: 80px;

		&:empty {
			background: url('/item-bg.png') no-repeat center;
			background-size: contain;
		}

		&.highlight-red {
			background-color: rgba(255, 2, 2, 0.35);
			border-radius: 12px;
		}

		&.pulse {
			animation: pulse 2s infinite;
			animation-delay: calc(1s * var(--random));
		}
	}

	/* Define the animation */
	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
