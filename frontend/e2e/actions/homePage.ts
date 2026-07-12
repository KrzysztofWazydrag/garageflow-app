import { Page, expect } from '@playwright/test';

const openHomePage = async (page: Page) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/GarageFlow App/);
  await expect(page.getByRole('heading', { name: 'Workshop Timeline' })).toBeVisible();
  await expect(page.getByLabel('Quick registration search')).toBeVisible();
};

export const homePageActions = {
  openHomePage,
};
