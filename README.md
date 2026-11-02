# RO’Lyfe Live Sports Center™

**All Sports. One Command Center.**

RO’Lyfe Live Sports Center™ is a mobile-friendly, independent sports information hub for live scores, schedules, matchups, sports news, podcasts, and official viewing resources.

## Current website

- `index.html` — responsive dark-theme sports hub and scoreboard interface.
- Live/schedule requests try the secured Supabase Edge Functions `sports-live-scores` (soccer) and `sports-nfl-scores` (American football) first.
- If the primary provider errors or returns no fixtures, the page checks a public ESPN scoreboard JSON fallback for the Premier League, LALIGA, Serie A, MLS, UEFA Champions League, NFL and College Football. This ESPN endpoint is public but undocumented; it is a fallback, not a guaranteed API contract.
- Soccer and American football cards select their feed and automatically load the scoreboard. A failed provider request is distinguished from an empty schedule.
- `?embed=classroom` opens a wider, navigation-reduced Sports Center view for the Trading Classroom. `?embed=market-lab` opens the Sector Scanner + Chart Lab as a standalone embedded workspace.
- News, podcast, and official viewing links help fans find trusted destinations.

## Sports categories

Soccer, basketball, American football, baseball, hockey, Formula 1, MMA, rugby, volleyball, handball, Australian football, and additional leagues as data access is verified.

## Technology

- HTML, CSS, and JavaScript
- Supabase Edge Functions
- API-Sports data services
- GitHub Pages static hosting

## Deploy with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under the build/deployment source, choose **Deploy from a branch** if that option is available.
3. Select branch `main` and folder `/(root)`, then save.
4. Wait for the Pages deployment to complete. The published address is typically `https://rolrichman.github.io/RO-Lyfe-Live-Sports-Center/`.
5. Test the site on a phone and verify score-feed responses. If Pages is configured with a different workflow, follow the repository's displayed deployment instructions.

## Supabase sports data functions

The page calls these secure Edge Function routes:

- `https://nzduinxmsmmdbonefifi.supabase.co/functions/v1/sports-live-scores?feed=soccer&mode=live`
- `https://nzduinxmsmmdbonefifi.supabase.co/functions/v1/sports-nfl-scores?feed=football&mode=live`

Schedule mode also sends `date=YYYY-MM-DD`. Provider credentials remain in Supabase Edge Function Secrets. Never put API keys in HTML, JavaScript, GitHub commits, or public browser configuration.

The mixed fallback uses public ESPN scoreboard JSON endpoints from the browser. It is explicitly labeled as an unofficial/undocumented fallback and may change independently of this repository.

## Browser checks

```bash
npm install
npx playwright install chromium
npm test
```

The **Sports Center browser tests** mock primary Supabase errors and fallback scoreboards so feed navigation can be tested without depending on live provider uptime. GitHub Actions runs the same checks on pushes and pull requests.

## Important limitations

- Only soccer and American-football feeds are connected in the current frontend; provider plan coverage and schedules may limit results.
- Sports data may be delayed, incomplete, or unavailable.
- Data API access does not grant rights to retransmit live games. This project links to official services and does not host game streams.
- This is an independent project and is not affiliated with any league, team, broadcaster, or data provider.

## Brand

**RO’Lyfe Live Sports Center™**  
*All Sports. One Command Center.*


## Visual design and coverage
- Dark high-tech interface with restrained amber-orange glow and orange-accented primary actions.
- Soccer remains the first-priority sport, with shortcuts to FIFA, UEFA and the Premier League.
- Tennis includes ATP Tour and WTA links; golf and cricket include PGA TOUR and ICC resources.
- Official links are destinations, not a guarantee of live-score coverage, stream availability, or regional access.
