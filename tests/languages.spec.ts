import { test, expect } from '@playwright/test';

test('Languages Test', async ({ page }) => {
	await page.goto('/');

	expect(await page.locator('li', { has: page.locator('text="Arabic"') }).getAttribute('aria-selected')).toBe('true')
	await page.getByText('Arabic').click();
	expect(await page.locator('li', { has: page.locator('text="Arabic"') }).getAttribute('aria-selected')).toBe('false')
	await page.getByText('Arabic').click();
	expect(await page.locator('li', { has: page.locator('text="Arabic"') }).getAttribute('aria-selected')).toBe('true')

	expect(await page.locator('li', { has: page.locator('text="English"') }).getAttribute('aria-selected')).toBe('true')
	await page.getByText('English').click();
	expect(await page.locator('li', { has: page.locator('text="English"') }).getAttribute('aria-selected')).toBe('false')
	await page.getByText('English').click();
	expect(await page.locator('li', { has: page.locator('text="English"') }).getAttribute('aria-selected')).toBe('true')
});
