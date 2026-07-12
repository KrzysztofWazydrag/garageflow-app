import { Page, expect } from '@playwright/test';

const openHomePage = async (page: Page) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/GarageFlow App/);
  await expect(page.getByRole('heading', { name: 'GarageFlow App' })).toBeVisible();
  await expect(page.getByText('Scaffold ready. GarageFlow domain features are not implemented yet.')).toBeVisible();
};

export const homePageActions = {
  openHomePage,
};
