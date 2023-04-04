import { test, expect } from '@playwright/test';

test('Hadith Page Test', async ({ page }) => {
	await page.goto('/')
	await page.goto('/bukhari:1');
	await expect(page.locator('.card').nth(3)).toContainText('Sahih al Bukhari 1')
})
