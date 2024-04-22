import { writable } from 'svelte/store';

export const discoveredItems = writable<string[]>([])

export const addToDiscovered = (newItem: string) => {
	discoveredItems.update(items => [...items, newItem]);
}