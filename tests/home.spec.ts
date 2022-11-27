import { test, expect } from '@playwright/test';

test('Home Page Test', async ({ page }) => {
	await page.goto('/');

	const grid = page.locator('main > div.grid')
	await expect(grid).toContainText('Sahih al Bukhari')
	await expect(grid).toContainText('Sahih Muslim')
	await expect(grid).toContainText('Sunan an Nasai')
	await expect(grid).toContainText('Sunan Abu Dawud')
	await expect(grid).toContainText('Jami At Tirmidhi')
	await expect(grid).toContainText('Sunan Ibn Majah')
	await expect(grid).toContainText('Muwatta Malik')
});
