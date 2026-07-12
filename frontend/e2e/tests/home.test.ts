import { test } from '@playwright/test';

import { homePageActions } from '../actions/homePage';
import { navigationActions } from '../actions/navigation';

test.describe('Home Page', () => {
  test('should open the GarageFlow placeholder shell', async ({ page }) => {
    await homePageActions.openHomePage(page);
  });

  test('should navigate to the home page', async ({ page }) => {
    await homePageActions.openHomePage(page);
    await navigationActions.navigateToHomePage(page);
  });
});
