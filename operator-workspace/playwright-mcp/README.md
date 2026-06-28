# Playwright MCP

Microsoft Playwright MCP is registered for browser control and customer-flow testing.

## Configured Locations

- Active OpenClaw Codex home: `C:\Users\frank\.openclaw\agents\main\agent\codex-home\config.toml`
- Regular Codex home: `C:\Users\frank\.codex\config.toml`

## Server

```powershell
npx.cmd @playwright/mcp@latest --browser chrome --output-dir C:\Users\frank\.openclaw\workspace\operator-workspace\playwright-mcp\outputs
```

## Use Cases

- Test the CarPlay landing page like a buyer.
- Verify mobile and desktop layout.
- Walk through Jotform and Stripe links.
- Check social/ad research pages when public browsing is enough.
- Capture screenshots and notes into this workspace.

## Notes

- New MCP servers usually become available to the agent after the host/session reloads.
- Until the live tool appears in the tool list, use local Playwright CLI or existing browser tools for immediate QA.

