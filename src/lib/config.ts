import { browser } from '$app/environment';

export const GAME_DURATION = 2;

export const BASE_CARDS = [
	'Axe',
	'BluePotion',
	'Chest',
	'Helm',
	'Torch',
	'Beer',
	'Book',
	'GoldenCoin',
	'Hammer',
	'SilverSword'
];

export const EXTRA_CARDS = [
	'Mushroom',
	'WizardHat',
	'RedPotion',
	'Meat',
	'GoldenIngot',
	'SilverKey'
];

export const PRIZES = [
	{ sec: 0, prize: 'Penkala' },
	{ sec: 4, prize: 'Loptica' },
	{ sec: 8, prize: 'Sticker' },
	{ sec: 10, prize: 'Lepeza' },
	{ sec: 16, prize: 'Notes' },
	{ sec: 19, prize: 'Torba' },
	{ sec: 22, prize: 'T-Shirt' }
];

export function getPrize(timeRemaining: number): string {
	const prizes: Array<{ sec: number; prize: string }> = getPrizesFromLocalStorage() ?? PRIZES;

	const sortedPrizes = [...prizes].sort((b, a) => a.sec - b.sec);

	const foundPrize = sortedPrizes.find(({ sec }) => timeRemaining >= sec);

	return foundPrize ? foundPrize.prize : 'No Prize';
}

export function getPrizesFromLocalStorage(): Array<{ sec: number; prize: string }> | null {
	if (!browser) return PRIZES;
	const prizes = localStorage.getItem('PRIZES');
	if (prizes) {
		return JSON.parse(prizes);
	}
	return null;
}

export function setPrizesToLocalStorage(prizes: Array<{ sec: number; prize: string }>): void {
	const filteredPrizes = prizes.filter((prize) => !isNaN(prize.sec));
	localStorage.setItem('PRIZES', JSON.stringify(filteredPrizes));
}
