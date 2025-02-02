import { test, expect } from '@playwright/test';

test('Languages Test', async ({ page }) => {
	
	await page.goto('/');

	await page.getByText('Languages').click();
	expect(await page.locator('label', { has: page.locator('text="Arabic"') }).getAttribute('aria-selected')).toBe('true')
	await page.getByRole('option', { name: 'Arabic' }).click();
	expect(await page.locator('li', { has: page.locator('text="Arabic"') }).getAttribute('aria-selected')).toBe('false')
	await page.getByRole('option', { name: 'Arabic' }).click();
	expect(await page.locator('li', { has: page.locator('text="Arabic"') }).getAttribute('aria-selected')).toBe('true')

	expect(await page.locator('li', { has: page.locator('text="English"') }).getAttribute('aria-selected')).toBe('true')
	await page.getByRole('option', { name: 'English' }).click();
	expect(await page.locator('li', { has: page.locator('text="English"') }).getAttribute('aria-selected')).toBe('false')
	await page.getByRole('option', { name: 'English' }).click();
	expect(await page.locator('li', { has: page.locator('text="English"') }).getAttribute('aria-selected')).toBe('true')
});
