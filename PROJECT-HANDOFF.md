# RO’Lyfe Live Sports Center™ — Project Handoff

**Repository:** [ROLRichman/RO-Lyfe-Live-Sports-Center](https://github.com/ROLRichman/RO-Lyfe-Live-Sports-Center)  
**Live site:** https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/  
**Updated:** 2026-11-02  
**Default branch:** `main`  
**Active branch:** `feature/sports-mixed-feed-embed-fix`  
**Status:** Changes are on an unmerged feature branch. Do not describe them as live until merged and GitHub Pages succeeds.

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

The current branch has source and test changes; CI status is pending until a pull request is created and Actions completes. The test mocks exercise the fallback logic but do not prove that live ESPN CORS/provider responses are available from every user's browser.

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
