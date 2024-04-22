<script lang="ts">
	import { BASE_CARDS, GAME_DURATION, getPrize, PRIZES } from '$lib/config';
	import MemoryCard from './MemoryCard.svelte';
	import { addToDiscovered, discoveredItems } from '../stores/game.store';
	import Timer from './Timer.svelte';

	let flippedPair: Array<{ id: number; card: string }> = [];
	let lockBoard: boolean = false;
	let gameOver = false;
	let gameRunning = false;
	let gameDuration = GAME_DURATION;
	let remainingTime: number | null = null;

	const getCards = () => {
		const cards = BASE_CARDS.flatMap((card) => [card, card]);
		cards.sort(() => Math.random() - 0.5);
		return cards;
	};

	let shuffledCards = getCards();

	const handleCardFlip = (idx: number, card: string) => {
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
</script>

<div class="game">
	<div class="board">
		<!--		PRIZE			-->
		<p class="prize">
			Your prize: <br />
			{#if gameOver && remainingTime !== null}
				{getPrize(remainingTime, PRIZES)}
			{:else}
				???
			{/if}
		</p>

		<!--		BOARD			-->
		{#each shuffledCards as card, index (index)}
			<MemoryCard
				item={card}
				onFlip={() => (lockBoard ? undefined : handleCardFlip(index, card))}
				showItem={flippedPair.some((item) => item.id === index) || $discoveredItems.includes(card)}
				notDiscovered={gameOver && !$discoveredItems.includes(card)}
			/>
		{/each}

		<!--		TIMER			-->
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
	</div>
</div>

<style lang="scss">
	.game {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}

	.timer {
		position: absolute;
		right: 0;
		margin: auto 0;
		transform: translateX(100%);
		align-self: center;
	}

	.prize {
		position: absolute;
		left: 0;
		margin: auto 0;
		transform: translateX(-120%);
		align-self: center;
		font-family: 'Pixel', sans-serif;
		font-size: 2.5rem;
		color: #fff;
		text-align: center;
	}

	.board {
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
</style>
