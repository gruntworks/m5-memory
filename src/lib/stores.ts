import { writable } from 'svelte/store';
import { getPrizesFromLocalStorage } from '$lib/config';

export const storagePrizes = writable(getPrizesFromLocalStorage());
