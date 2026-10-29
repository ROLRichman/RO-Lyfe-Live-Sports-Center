# RO’Lyfe Live Sports Center™

**All Sports. One Command Center.**

RO’Lyfe Live Sports Center™ is a mobile-friendly, independent sports information hub for live scores, schedules, matchups, sports news, podcasts, and official viewing resources.

## Current website

- `index.html` — responsive dark-theme sports hub and scoreboard interface.
- Live/schedule data requests are routed through the existing Supabase Edge Function at `sports-data`.
- The currently connected feeds are soccer and American football. Other sport categories link to official resources while data integrations are verified.
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

## Supabase data function

The page calls:

`https://nzduinxmsmmdbonefifi.supabase.co/functions/v1/sports-data`

Expected query parameters include `feed=soccer|football`, `mode=live|schedule`, and a `date=YYYY-MM-DD` for schedule requests. This frontend expects the function to allow browser CORS requests and return JSON. If the endpoint's current response shape differs, adjust the normalization in `index.html`.

Keep provider credentials in Supabase project secrets. Never put API keys in HTML, JavaScript, GitHub commits, or public browser configuration.

## Important limitations

- Only soccer and American-football feeds are connected in the current frontend; provider plan coverage and schedules may limit results.
- Sports data may be delayed, incomplete, or unavailable.
- Data API access does not grant rights to retransmit live games. This project links to official services and does not host game streams.
- This is an independent project and is not affiliated with any league, team, broadcaster, or data provider.

## Brand

**RO’Lyfe Live Sports Center™**  
*All Sports. One Command Center.*
