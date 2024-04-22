<script lang="ts">
	import { base } from '$app/paths';
	export let item: string;
	export let onFlip: () => void | undefined;
	export let showItem = false;
	export let notDiscovered = false;
</script>

<div
	class="card {!showItem && !notDiscovered ? 'pulse' : ''} {notDiscovered ? 'highlight-red' : ''}"
	on:click={() => {
		onFlip?.();
	}}
	on:keydown={undefined}
	role="button"
	tabindex="0"
	style="--random:{Math.random()};"
>
	{#if showItem || notDiscovered}
		<img class="pixelated" src={`${base}/items/${item}.png`} alt={item} width="80" height="80" />
	{/if}
</div>

<style lang="scss">
	.card {
		border-radius: 8px;
		cursor: pointer;
		user-select: none;
		display: grid;
		place-items: center;
		width: 100px;
		height: 100px;
		overflow: hidden;

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
