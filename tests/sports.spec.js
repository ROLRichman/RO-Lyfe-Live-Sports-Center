const { test, expect } = require('@playwright/test');

function mockSportsProviders(page) {
  let soccerPrimaryCalls = 0;
  let footballPrimaryCalls = 0;

  const corsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'authorization, apikey, accept, content-type'
  };

  const primaryFailure = async (route, kind) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 200, headers: corsHeaders, body: '' });
      return;
    }
    if (kind === 'soccer') soccerPrimaryCalls++;
    else footballPrimaryCalls++;
    await route.fulfill({
      status: 502,
      headers: corsHeaders,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Simulated upstream provider outage' })
    });
  };

  page.route('**/functions/v1/sports-live-scores**', route => primaryFailure(route, 'soccer'));
  page.route('**/functions/v1/sports-nfl-scores**', route => primaryFailure(route, 'football'));

  page.route('**/apis/site/v2/sports/**/scoreboard**', async route => {
    const path = new URL(route.request().url()).pathname;
    let events = [];
    if (path.includes('/soccer/eng.1/')) {
      events = [{
        id: 'soccer-test-1',
        date: '2026-11-02T20:00:00Z',
        status: { type: { detail: 'Scheduled' } },
        competitions: [{ competitors: [
          { homeAway: 'home', team: { displayName: 'Arsenal' }, score: '2' },
          { homeAway: 'away', team: { displayName: 'Fulham' }, score: '1' }
        ] }]
      }];
    } else if (path.includes('/football/nfl/')) {
      events = [{
        id: 'nfl-test-1',
        date: '2026-11-03T01:15:00Z',
        status: { type: { detail: 'Scheduled' } },
        competitions: [{ competitors: [
          { homeAway: 'home', team: { displayName: 'Philadelphia Eagles' }, score: '—' },
          { homeAway: 'away', team: { displayName: 'Kansas City Chiefs' }, score: '—' }
        ] }]
      }];
    }
    await route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      contentType: 'application/json',
      body: JSON.stringify({ events })
    });
  });

  return {
    getSoccerPrimaryCalls: () => soccerPrimaryCalls,
    getFootballPrimaryCalls: () => footballPrimaryCalls
  };
}

test('soccer and football cards actually load their selected mixed score feeds', async ({ page }) => {
  const calls = mockSportsProviders(page);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('#message')).toContainText('Mixed fallback');
  await expect(page.locator('#scores-list')).toContainText('Arsenal');
  await expect(page.locator('#scores-list')).toContainText('Fulham');
  expect(calls.getSoccerPrimaryCalls()).toBeGreaterThan(0);

  await page.locator('[data-jump-feed="football"]').click();
  await expect(page.locator('#message')).toContainText('Mixed fallback');
  await expect(page.locator('#scores-list')).toContainText('Philadelphia Eagles');
  await expect(page.locator('#scores-list')).toContainText('Kansas City Chiefs');
  expect(calls.getFootballPrimaryCalls()).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test('embedded Market Lab opens as a standalone scanner view and stays mobile-width', async ({ page }) => {
  mockSportsProviders(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?embed=market-lab');

  await expect(page.locator('html')).toHaveClass(/market-lab-embed/);
  await expect(page.locator('#market-lab-panel')).toHaveJSProperty('open', true);
  await expect(page.locator('#market-sector')).toBeVisible();
  await expect(page.locator('#market-timeframe')).toBeVisible();
  await expect(page.locator('#market-scan-mode')).toBeVisible();
  await expect(page.locator('#market-run-sector')).toBeVisible();
  await expect(page.locator('#market-indicator-details')).toBeAttached();

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    body: document.body.scrollWidth
  }));
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 2);
});

test('classroom embed hides the extra navigation without narrowing the sports page', async ({ page }) => {
  mockSportsProviders(page);
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/?embed=classroom');

  await expect(page.locator('html')).toHaveClass(/classroom-embed/);
  await expect(page.locator('.topbar')).toBeHidden();
  await expect(page.locator('#scores')).toBeVisible();
  await expect(page.locator('#sports')).toBeVisible();
  const size = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    main: document.querySelector('main#top').getBoundingClientRect().width
  }));
  expect(size.main).toBeGreaterThan(size.viewport * 0.94);
});

test('Sports News YouTube resource opens a sports-specific destination', async ({ page }) => {
  mockSportsProviders(page);
  await page.goto('/');
  const youtube = page.getByRole('link', { name: /YouTube · Sports Highlights/ });
  await expect(youtube).toHaveAttribute('href', /youtube\.com\/results\?search_query=official\+sports\+highlights/);
});
