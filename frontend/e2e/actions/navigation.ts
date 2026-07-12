import { Page, expect } from '@playwright/test';

const navigateToHomePage = async (page: Page) => {
  const link = page.getByRole('link', { name: 'Home' });

  await expect(link).toHaveAttribute('href', '/');
  await link.click();

  await expect(page).toHaveURL('');
};

export const navigationActions = {
  navigateToHomePage,
};
