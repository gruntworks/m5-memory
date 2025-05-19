import { browser } from '$app/environment';

export const GAME_DURATION = 45;

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
	{ sec: 0, prize: 'Kemijska' },
	{ sec: 5, prize: 'Loptica ili Sticker' },
	{ sec: 10, prize: 'Lepeza ili Notes' },
	{ sec: 15, prize: 'Torba ili Čarape' },
	{ sec: 20, prize: 'Majica ili Kapa' }
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
