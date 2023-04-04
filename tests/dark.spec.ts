import { test, expect } from '@playwright/test';

test('Dark Theme Test', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('html')).not.toHaveClass('dark')
	
	await page.getByTestId('svg-icon').nth(0).click();
	await page.getByRole('switch', { name: 'Light Switch' }).click();
	await expect(page.locator('html')).toHaveClass('dark')
});
