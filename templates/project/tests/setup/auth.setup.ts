import { test as setup, expect } from '@playwright/test';
import { credentialsFor } from '../../src/helpers/credentials';
import { AUTH_FILE } from '../../playwright.config';

// Runs only when LOGIN is true in playwright.config.ts. The locators are a stub:
// the login page step of /init-project replaces them with a LoginPage object.
setup('log in and save the session', async ({ page }) => {
  const { username, password } = credentialsFor('session');
  await page.goto('/');
  await page.getByLabel('Email').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
  await page.context().storageState({ path: AUTH_FILE });
});
