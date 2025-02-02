import { test, expect } from '@playwright/test';

test('Book Page Test', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'Sahih al Bukhari صحيح البخاري' }).click();
	await expect(page).toHaveURL('/bukhari');
	await page.getByRole('link', { name: '1 - Revelation كتاب بدء الوحى 1 to 7' }).click();
	await expect(page).toHaveURL('/bukhari/1');

	
	await expect(page.locator('.crumb').nth(2)).toHaveText('Revelation')
	await expect(page.locator('.card').nth(3)).toContainText('Sahih al Bukhari 1')
})
