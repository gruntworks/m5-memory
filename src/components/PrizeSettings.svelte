<script lang="ts">
	import { getPrizesFromLocalStorage, setPrizesToLocalStorage, PRIZES } from '$lib/config';

	export let open = false;
	export let onClose: () => void;
	let prizes = getPrizesFromLocalStorage() ?? PRIZES;

	// Function to handle input change
	const handlePrizeNameChange = (key: number, event: Event) => {
		prizes[key] = { sec: prizes[key].sec, prize: (event?.target as HTMLInputElement).value };
	};

	const handleSecondChange = (key: number, event: Event) => {
		prizes[key] = {
			sec: parseInt((event?.target as HTMLInputElement).value),
			prize: prizes[key].prize
		};
	};

	// Call this function to save updated prizes when necessary (like before component destruction)
	const saveUpdatedPrizes = (): void => {
		setPrizesToLocalStorage(prizes);
	};

	// Add new prize
	const addPrize = (): void => {
		prizes = [...prizes, { sec: NaN, prize: '' }];
	};

	const reset = (): void => {
		prizes = PRIZES;
		saveUpdatedPrizes();
	};

	const remove = (key: number) => {
		prizes = [...prizes.slice(0, key), ...prizes.slice(key + 1)];
		saveUpdatedPrizes();
	};
</script>

<dialog {open}>
	<p>Settings</p>
	<button class="close" on:click={onClose}>✕</button>
	{#each Object.values(prizes) as { sec, prize }, key}
		<div>
			<input type="number" value={sec} on:input={(event) => handleSecondChange(key, event)} />
			<input type="text" value={prize} on:input={(event) => handlePrizeNameChange(key, event)} />
			<button on:click={() => remove(key)}>❌</button>
		</div>
	{/each}

	<button on:click={saveUpdatedPrizes}>SAVE</button>
	<button on:click={addPrize}>ADD NEW</button>
	<button on:click={reset}>RESET</button>
</dialog>

<style>
	.close {
		position: absolute;
		right: 12px;
		top: 12px;
	}
</style>
