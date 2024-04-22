export const GAME_DURATION = 40;

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

export const PRIZES = {
	0: 'Loptica',
	5: 'Sticker',
	10: 'Lepeza',
	18: 'Notes',
	20: 'Torba',
	23: 'T-Shirt'
};

export function getPrize(timeRemaining: number, prizes: { [key: number]: string }) {
	let prize = 'No Prize';

	// Convert the PRIZES object keys into numbers and sort them in descending order
	const sortedKeys = Object.keys(prizes)
		.map(Number)
		.sort((a, b) => b - a);

	// Find the closest key that is less than or equal to the remaining time
	for (let i = 0; i < sortedKeys.length; i++) {
		if (timeRemaining >= sortedKeys[i]) {
			prize = prizes[sortedKeys[i]];
			break;
		}
	}

	return prize;
}
