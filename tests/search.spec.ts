import { test, expect } from '@playwright/test';

test('Search Page Test', async ({ page }) => {
	await page.goto('/');

	await page.getByPlaceholder('Search...').click();
	await page.getByPlaceholder('Search...').fill('greed');
	await page.getByPlaceholder('Search...').press('Enter');

	await expect(page).toHaveURL('/search?q=greed&lang=ara%2Ceng');
	const textContainer = page.locator('.card').first()
	await expect(textContainer).toContainText('greed')
})
