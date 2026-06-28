# Circuit Operator Workspace

This is the working bench for autonomous CarPlay funnel execution.

## Lanes

- `playwright-mcp/` - Microsoft Playwright MCP config notes and browser output files.
- `browser-qa/` - customer-flow QA checklists, screenshots, and launch blockers.
- `market-watch/` - competitor hooks, ad angles, comments, offers, and source links.
- `content-lab/` - reel scripts, captions, ad copy, and creative tests.
- `funnel-ops/` - Stripe/Jotform/site launch checklists and offer decisions.

## Operating Rules

- Research, inspect, draft, test, and organize freely.
- Do not post, comment, DM, run ads, spend money, or create commitments without Frank's approval.
- Treat Amazon/Prime sourcing as internal only; customer-facing copy should say fast shipping without naming the sourcing reason.
- Keep the CarPlay offer anchored to the confirmed terms: sale price $109.99, regular price $150, backup camera included, 30-day replacement policy, same-day shipping on timely orders, delivery expected in 4 days or less.

## Current Tooling

- Microsoft Playwright MCP registered in Codex config as `playwright`.
- MCP command: `npx.cmd @playwright/mcp@latest --browser chrome --output-dir C:\Users\frank\.openclaw\workspace\operator-workspace\playwright-mcp\outputs`
- Chrome DevTools MCP registered in Codex config as `chrome-devtools`.
- Chrome DevTools command: `cmd /c npx -y chrome-devtools-mcp@latest`
- Chrome DevTools usage statistics opt-out is enabled with `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1`.
- Local research CLIs for the CarPlay project: `yt-dlp` and `gallery-dl` in `projects/carplayradiohub-site/research-tools/.venv`.
