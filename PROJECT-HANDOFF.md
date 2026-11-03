## November 2, 2026 — All-Sports scoreboard, stats, live state and scanner navigation (PR #2)

- Added an All Sports scoreboard selector for the full 15-category card list: Soccer, Basketball, American Football, Baseball, Hockey, Tennis, Golf, Cricket, Formula 1, MMA, Rugby, Volleyball, Handball, Australian Football and More Leagues. Each category card now has its own Open Scores shortcut. Existing soccer/football quick buttons and official-resource links remain.
- Soccer and American Football retain the secured Supabase/API-Sports primary paths; their public ESPN fallback remains. The other configured competitions try the public ESPN site scoreboard. These ESPN JSON endpoints are undocumented and can change; some leagues/sports may return no fixtures or reject browser requests.
- Cricket currently tries the public ESPN numeric route `cricket/8048`, but endpoint references are not consistent. It is a best-effort attempt, not a guaranteed cricket feed. Handball remains official-link-only until a dependable scoreboard route is verified. The app reports unavailable feeds rather than inventing a score.
- Score cards include event date/status, teams, scores, venue, season record and match description when returned. Opening Stats & Match History lazily requests the provider summary and shows only returned team statistics, leaders, records or season-series/head-to-head detail. It never inserts sample or estimated stats.
- In-progress matches get a subtle pulsing state indicator; the animation is disabled under `prefers-reduced-motion`.
- The Full RTIC Indicator Lab expander is now strongly highlighted, with larger visible arrow/open action, clearer no-scan guidance, WAITING state hierarchy, and distinct styling for MACD, Stochastic, advanced oscillator settings and provider status.
- A Scanner Desk dropdown connects to the existing Tactical RTIC scanner, Live Desk Watchlist Scanner, Sector Scanner & Chart Lab, Market Terminal and Calculator Pro module-status page. Scanner engines remain in their original repositories and are not duplicated.
- Updated Playwright test coverage: **7 browser tests passed** on the latest Sports Center commit (run #41553214157). The tests use mocked provider payloads; they verify UI and mapping logic, not current live ESPN availability.

**Current PR:** https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center/pull/2  
**Current branch:** `feature/all-sports-scoreboard-stats-scanner-menu`  
**Status:** Open, mergeable, tests green. Not merged or deployed.  
**Prior release:** PR #1 remains merged/deployed; this PR #2 is a separate additive follow-up.

---

# RO’Lyfe Live Sports Center™ — Project Handoff

**Repository:** [ROLRichman/RO-Lyfe-Live-Sports-Center](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center)  
**Live site:** https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/  
**Updated:** 2026-11-02  
**Default branch:** `main`  
**Active branch:** `feature/all-sports-scoreboard-stats-scanner-menu`  
**Status:** Earlier PR #1 is merged and GitHub Pages deployment succeeded. Current all-sports expansion is PR #2 on an unmerged feature branch and is not live until approved, merged and deployed.

---

## 1. Current request and additive changes

The requested work repairs the soccer and American Football score shortcuts, adds a mixed provider fallback, improves the Classroom embed, and reuses the existing Market Lab inside other RO’Lyfe pages. Existing sports resources, watch links and user-owned GitHub links are preserved.

### Implemented on the feature branch

- Soccer and American Football shortcut cards now change the selected feed **and call the loader**. They no longer simply navigate to the top of the scoreboard without loading results.
- The scoreboard tries the Supabase Edge Function first:
  - `sports-live-scores` for soccer
  - `sports-nfl-scores` for American football
- If the primary response fails or returns no fixtures, a browser-side mixed fallback queries public ESPN scoreboard JSON for:
  - Soccer: Premier League, LALIGA, Serie A, MLS and UEFA Champions League.
  - Football: NFL and College Football.
- ESPN results are normalized into the existing scoreboard card format. The status text distinguishes primary-provider error, fallback response, no fixtures and both providers unavailable.
- The YouTube resource is now a sports-specific search link for official highlights and press conferences instead of the generic YouTube homepage.
- Added a scanner-only `?embed=market-lab` view. It hides unrelated Sports Center sections, opens the existing Sector Scanner dropdown and posts its rendered height to an embedding parent.
- Added a wider, reduced-navigation `?embed=classroom` view for the Trading Intelligence Classroom.
- Expanded Market Lab timeframe choices with provider-supported 30m, 2h, 1w and 1mo bars in addition to existing 5m, 15m, 1h, 4h, 1d, 6M daily and 1-year daily choices.
- Kept the Market Lab scanner logic in this repository and embedded this same view from the Live Desk, avoiding a second scanner engine.
- Added the RO’Lyfe Auction Capital Machine app link to the Sports Center workspace navigation.
- Retained user-owned GitHub links to the Pool project, Strategy Arena and the RO’Lyfe GitHub profile.

## 2. Provider status and limitations

- Supabase project: `nzduinxmsmmdbonefifi`.
- A recent logged request to `sports-live-scores?feed=soccer&mode=live` reached the Edge Function but returned HTTP 502. The page-to-Supabase route is working; the upstream provider call needs to recover or be bypassed.
- The new fallback uses ESPN's publicly accessible but undocumented scoreboard JSON endpoints. It is not an official supported ESPN API contract, can change without notice, and may be subject to browser/network restrictions. It is a fallback, not a guarantee of real-time coverage.
- If both providers fail, the page keeps official league/scoreboard links available and reports feed unavailability rather than presenting an outage as a no-games result.
- Sports Center does not host or retransmit live game video. Broadcast rights and availability remain with the rights holders.
- API keys and provider credentials must remain in Supabase Edge Function Secrets. Do not store them in this repository or commit logs containing secrets.

## 3. Browser tests

Added Playwright tests in `tests/sports.spec.js` covering:
- Soccer and football card navigation triggering a provider request.
- Primary Supabase error followed by mocked ESPN fallback results.
- Scanner-only embedded view and mobile horizontal-width behavior.
- Reduced-navigation Classroom embed.
- Targeted YouTube sports destination.

Workflow: `.github/workflows/sports-tests.yml`  
Run locally:

```bash
npm install
npx playwright install chromium
npm test
```

Pull request: [#1 — Fix mixed soccer and football feeds and responsive embed views](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center/pull/1).

- The **Sports Center browser tests** workflow run [#10](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center/actions/runs/41540162912) completed successfully on branch head `ef1f0300f1e10749f78ae599f50bce69de2005b2`.
- The run verified card-triggered feed loading, primary-failure fallback normalization, Market Lab embed visibility/mobile width, Classroom embed width and the YouTube destination.
- A first CI attempt failed before browser tests because `ubuntu-latest` had advanced to Ubuntu 26.04, unsupported by pinned Playwright 1.56.1; the workflow now uses Ubuntu 24.04. A preceding run also identified the missing npm lockfile/cache config; cache was removed.
- The test mocks exercise the fallback logic but do not prove live ESPN browser/CORS responses or provider coverage. The pull request is still open and not deployed.

## 4. Preserve

Do not remove or replace existing:
- Soccer and football scoreboard controls.
- Sports categories, resource cards, official league/viewing links, news and podcast links.
- RO’Lyfe workspace menu and the user's own project/profile GitHub links.
- Existing Sector Scanner controls, 17-sector universe, Standard/Sniper screening, RTIC 14-panel study engine, chart height control and market-data wiring.
- Existing sports/league disclaimers and no-broadcast-retransmission language.

## 5. Next actions

1. Review pull request from `feature/sports-mixed-feed-embed-fix` to `main`.
2. Confirm Sports Center browser workflow is green.
3. Verify primary/fallback score loading in a real browser and check actual feed coverage.
4. Review the scanner-only embed inside the Live Desk and the wider Classroom embed on mobile and desktop.
5. Merge only after the review/CI checks pass and the user authorizes it.
6. Confirm GitHub Pages deployment after merge.

## 6. Useful links

- [Live Sports Center](https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/)
- [Repository](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center)
- [Actions](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center/actions)
- [Trading Intelligence Classroom](https://rolrichman.github.io/RO-Lyfe-Trading-Intelligence-Classroom/)
- [Auction Capital Machine](https://rolrichman.github.io/ro-lyfe-auction-capital-machine/)
