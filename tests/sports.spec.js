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

test('all sport categories offer scoreboard selection and NBA opens real-feed stats/history panel', async ({ page }) => {
  mockSportsProviders(page);
  await page.goto('/');
  const options = await page.locator('#sportFeedSelect option').evaluateAll(nodes => nodes.map(node => node.value));
  expect(options).toEqual(['soccer','basketball','football','baseball','hockey','tennis','golf','cricket','f1','mma','rugby','volleyball','handball','afl','more']);
  await page.locator('#sportFeedSelect').selectOption('basketball');
  await expect(page.locator('#message')).toContainText('ESPN public scoreboard');
  await expect(page.locator('#scores-list')).toContainText('Boston Celtics');
  await expect(page.locator('#scores-list')).toContainText('Philadelphia 76ers');
  await expect(page.locator('#scores-list .game')).toHaveClass(/is-live/);
  await expect(page.locator('#scores-list .live-dot')).toBeVisible();
  await expect(page.locator('#scores-list')).toContainText('8-2');
  await expect(page.locator('#scores-list')).toContainText('TD Garden');
  const details = page.locator('#scores-list .game-details').first();
  await expect(details.locator('summary')).toContainText('Stats & Match History');
  await details.locator('summary').click();
  await expect(details).toHaveJSProperty('open', true);
  await expect(details).toContainText('Points');
  await expect(details).toContainText('Rebounds');
});

test('non-connected sports show a clear provider status instead of fake fixtures', async ({ page }) => {
  mockSportsProviders(page);
  await page.goto('/');
  await page.locator('#sportFeedSelect').selectOption('handball');
  await expect(page.locator('#message')).toContainText('scoreboard feed not connected');
  await expect(page.locator('#scores-list')).toContainText('dependable public scoreboard endpoint');
  await expect(page.locator('#scores-list .game')).toHaveCount(0);
  await page.locator('#sportFeedSelect').selectOption('cricket');
  await expect(page.locator('#message')).toContainText('scoreboard feed not connected');
});

test('RTIC Indicator Lab expander is visibly highlighted and its advanced panels are identifiable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?embed=market-lab');
  await expect(page.locator('#market-indicator-details > summary')).toContainText('FULL RTIC INDICATOR LAB');
  await expect(page.locator('#market-indicator-details > summary')).toContainText('14 visual panels');
  await expect(page.locator('#market-indicator-details > summary .indicator-lab-open')).toBeVisible();
  await page.locator('#market-indicator-details > summary').click();
  await expect(page.locator('#rticDataStatus')).toContainText('NO PROVIDER SCAN LOADED YET');
  await expect(page.locator('#rticScanOutput')).toContainText('Pick a result row');
  await expect(page.locator('#rticMacdReadout')).toContainText('Waiting for returned historical bars');
  await expect(page.locator('#rticStochReadout')).toContainText('Waiting for returned historical bars');
  await expect(page.locator('#rticAdvancedOscSettings > summary')).toContainText('Advanced MACD / Stochastic settings');
  await expect(page.locator('#rticProviderDetails > summary')).toContainText('Provider configuration status');
});
