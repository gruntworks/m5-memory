<script lang="ts">
	import {
		BASE_CARDS,
		GAME_DURATION,
		getPrize,
		getPrizesFromLocalStorage,
		PRIZES,
		setPrizesToLocalStorage
	} from '$lib/config';
	import MemoryCard from './MemoryCard.svelte';
	import { addToDiscovered, discoveredItems } from '../stores/game.store';
	import Timer from './Timer.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import PrizeSettings from './PrizeSettings.svelte';
	import { storagePrizes } from '$lib/stores';

	export let mobileLayout: boolean;

	let flippedPair: Array<{ id: number; card: string }> = [];
	let lockBoard: boolean = false;
	let gameOver = false;
	let gameRunning = false;
	let gameDuration = GAME_DURATION;
	let remainingTime: number | null = null;
	let openSettings: boolean = false;

	const getCards = () => {
		const cards = BASE_CARDS.flatMap((card) => [card, card]);
		cards.sort(() => Math.random() - 0.5);
		return cards;
	};

	let shuffledCards = getCards();

	const handleCardFlip = (idx: number, card: string) => {
		if (lockBoard) return;

		// Start when flipping first
		gameRunning = true;

		// If clicking on item that is already flipped, do nothing
		if (flippedPair.some((item) => item.id === idx)) return;

		// Add to flipped when clicking on item
		if (flippedPair.length < 2) {
			flippedPair = [...flippedPair, { id: idx, card }];
		}

		// Check when two are flipped
		if (flippedPair.length === 2) {
			lockBoard = true;
			if (flippedPair[0].card === flippedPair[1].card) {
				addToDiscovered(card);
			}
			setTimeout(() => {
				if (!gameRunning) return;
				flippedPair = [];
				lockBoard = false;
			}, 300);
			return;
		}
	};

	const resetBoard = () => {
		gameRunning = false;
		flippedPair = [];
		discoveredItems.set([]);
		shuffledCards = getCards();
		gameDuration = GAME_DURATION;
		lockBoard = false;
		gameOver = false;
	};

	$: {
		if ($discoveredItems.length === shuffledCards.length / 2) {
			lockBoard = true;
			gameRunning = false;
			gameOver = true;
		}
	}

	onMount(() => {
		// GET/SET PRIZES FROM STORAGE
		const prizes = getPrizesFromLocalStorage();
		if (!prizes) {
			setPrizesToLocalStorage(PRIZES);
		}

		// PRELOAD ITEMS IMAGES
		const imagesToPreload = BASE_CARDS.map((name) => `${base}/items/${name}.png`);

		imagesToPreload.forEach((src) => {
			const img = new Image();
			img.src = src;
		});
	});
</script>

<div class="game" class:mobile={mobileLayout}>
	<div class="logo">
		<button on:click={() => (openSettings = true)}>
			<img src={`${base}/m5_logo_white.svg`} alt="m5_logo" width="100" height="80" />
		</button>
		<p>Memory</p>
	</div>

	<div class="board" class:mobile={mobileLayout}>
		<!--		MOBILE timer			-->
		{#if mobileLayout}
			<div class="timer">
				<Timer
					duration={gameDuration}
					ticking={gameRunning}
					onReset={resetBoard}
					onStop={(time) => {
						remainingTime = time;
					}}
					onTimeout={() => {
						lockBoard = true;
						gameRunning = false;
						gameOver = true;
					}}
				/>
			</div>
		{/if}

		{#if !mobileLayout}
			<!--		PRIZE			-->
			<div class="prize">
				<div class="prize-list">
					{#each $storagePrizes ?? PRIZES as { sec, prize }}
						<span>{sec}+ sec → {prize}</span><br />
					{/each}
				</div>
				<div class="result">
					Your prize: <br />
					{#if gameOver && remainingTime !== null}
						{getPrize(remainingTime)}
					{:else}
						???
					{/if}
				</div>
			</div>
		{/if}

		<!--		BOARD			-->
		<div class="cards">
			{#each shuffledCards as card, index (index)}
				<MemoryCard
					item={card}
					onFlip={() => (lockBoard ? undefined : handleCardFlip(index, card))}
					showItem={flippedPair.some((item) => item.id === index) ||
						$discoveredItems.includes(card)}
					notDiscovered={gameOver && !$discoveredItems.includes(card)}
				/>
			{/each}
		</div>

		<!--		DESKTOP timer			-->
		{#if !mobileLayout}
			<div class="timer">
				<Timer
					duration={gameDuration}
					ticking={gameRunning}
					onReset={resetBoard}
					onStop={(time) => {
						remainingTime = time;
					}}
					onTimeout={() => {
						lockBoard = true;
						gameRunning = false;
						gameOver = true;
					}}
				/>
			</div>
		{/if}
	</div>

	<PrizeSettings open={openSettings} onClose={() => (openSettings = false)} />
</div>

<style lang="scss">
	.game {
		display: grid;
		place-items: center;
		&.mobile {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.logo {
			cursor: pointer;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 20px;
			font-family: 'Pixel', sans-serif;

			button {
				all: unset;
			}

			p {
				margin: 0;
				color: white;
				font-size: 2em;
			}
		}
	}

	.timer {
		margin: auto 0;
		align-self: center;
	}

	.prize {
		left: 0;
		margin: auto 0;
		color: #fff;
		display: grid;
		place-items: center;
		align-self: center;
		padding: 16px;
		.prize-list {
			font-size: 1.2rem;
			font-family: 'Pixel', sans-serif;
			margin-bottom: 24px;
		}
		.result {
			font-family: 'Pixel', sans-serif;
			font-size: 2.5rem;
			text-align: center;
		}
	}

	.board {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		.cards {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: repeat(4, 1fr);
			gap: 6px;
			background-color: rgba(0, 0, 0, 0.4);
			padding: 8px;
			border-radius: 8px;
			margin: auto;
			position: relative;
		}
		&.mobile {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.cards {
				grid-template-columns: repeat(4, 1fr);
				grid-template-rows: repeat(5, 1fr);
				padding: 0;
				gap: 2px;
			}
			.timer {
				all: unset;
			}
		}
	}
</style>
