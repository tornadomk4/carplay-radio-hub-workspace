# MCP Tooling Preflight - 2026-06-27

## Installed

- `playwright`
  - Source: `https://github.com/microsoft/playwright-mcp`
  - Configured command: `npx.cmd @playwright/mcp@latest --browser chrome --output-dir C:\Users\frank\.openclaw\workspace\operator-workspace\playwright-mcp\outputs`
  - Status: enabled and live in the current session.
  - Use: browser QA, screenshots, form testing, Stripe/Jotform click-through checks, public research.

- `chrome-devtools`
  - Source: `https://github.com/ChromeDevTools/chrome-devtools-mcp`
  - Configured command: `cmd /c npx -y chrome-devtools-mcp@latest`
  - Status: enabled in both Codex configs; expected to appear after host/session reload.
  - Privacy: `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1`
  - Use: console, network, and performance debugging for landing pages and checkout flows.

## Deferred

- Fetch MCP: useful for page-to-markdown fetching, but overlaps with existing web/OpenClaw fetch tools and should be scoped carefully.
- Filesystem/Git MCP: optional because Codex already has local file and git access.
- GitHub MCP: defer until Frank explicitly approves GitHub auth.
- Stripe MCP: defer until Frank is ready to connect Stripe; keep read-only or approval-gated for writes.
- Firecrawl/SiteAudit hosted tools: defer unless free/local path is confirmed and no paid API is required.

