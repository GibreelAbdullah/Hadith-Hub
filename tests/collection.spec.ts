import { test, expect } from '@playwright/test';

test('Search Page Test', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Sahih al Bukhari صحيح البخاري' }).click();
	await expect(page).toHaveURL('/bukhari');
	await expect(page.locator('.crumb').nth(1)).toHaveText('Sahih al Bukhari')
	await expect(page.locator('.hadithGroup').first()).toContainText('Revelation')
})
