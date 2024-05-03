<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	export let duration: number;
	export let ticking: boolean = false;
	export let onReset: () => void | undefined;
	export let onTimeout: () => void | undefined;
	export let onStop: (time: number) => void | undefined;
	let timerInterval: number | undefined;
	let seconds = duration;

	const countdown = () => {
		if (seconds > 0) {
			seconds -= 1;
		} else {
			clearInterval(timerInterval);
			if (onTimeout) onTimeout();
		}
	};

	// Start timer
	const startTimer = () => {
		seconds = duration;
		timerInterval = setInterval(countdown, 1000);
	};

	// Reset timer
	const reset = () => {
		clearInterval(timerInterval);
		seconds = duration;
		if (onReset) onReset();
	};

	// Start/Stop timer based on ticking prop
	$: {
		if (ticking) {
			startTimer();
		}
	}

	// // Reset Timer
	$: {
		if (!ticking && seconds !== duration) {
			clearInterval(timerInterval);
		}
	}

	onMount(() => {
		if (ticking) {
			startTimer();
		}
	});

	$: {
		if (!ticking && seconds !== duration) {
			onStop?.(seconds);
		}
	}
</script>

<main>
	<p>Time: {Math.floor(seconds / 60)}:{('0' + (seconds % 60)).slice(-2)}</p>
	<button
		class="reset-button"
		on:click={() => {
			reset();
		}}
	>
		<img class="pixelated" src={`${base}/redo.webp`} alt="reset" width="73" />
	</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		gap: 20px;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 12px;
	}

	.reset-button {
		all: unset;
		cursor: pointer;
	}

	p {
		font-family: 'Pixel', sans-serif;
		font-size: 2rem;
		color: #fff;
		margin: 0;
	}
</style>
