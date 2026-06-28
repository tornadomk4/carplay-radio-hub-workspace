# Tooling Preflight - CarPlay Research Stack

Date: 2026-06-27

## Decision

Use a conservative local research stack:

- Playwright for screenshots, site checks, and browser verification.
- `yt-dlp` for metadata from public video URLs when we have specific links.
- `gallery-dl` for metadata/media checks from supported public gallery/social URLs when appropriate.
- Official/public web surfaces for discovery: Meta Ad Library, TikTok Creative Center, YouTube search, Amazon search, Instagram/TikTok search pages.

Avoid installing unofficial TikTok/Instagram API wrappers as the default path. They can be useful later, but they are brittle, often require logins/cookies, and carry more account/TOS risk than we need right now.

## Repo Preflight

| Tool | Repo | Stars | Updated | License | Verdict |
|---|---|---:|---|---|---|
| yt-dlp | https://github.com/yt-dlp/yt-dlp | 173,725 | 2026-06-27 | Unlicense | Install locally. Strongest general-purpose public video metadata/downloader CLI. |
| gallery-dl | https://github.com/mikf/gallery-dl | 18,676 | 2026-06-27 | GPL-2.0 | Install locally. Useful for supported public galleries/social media, but use conservatively. |
| Playwright | https://github.com/microsoft/playwright | 91,761 | 2026-06-27 | Apache-2.0 | Already useful. Keep for screenshots and site QA. |
| Playwright MCP | https://github.com/microsoft/playwright-mcp | 34,426 | 2026-06-27 | Apache-2.0 | Worth considering if OpenClaw browser remains flaky. Not installed yet. |
| Instaloader | https://github.com/instaloader/instaloader | 12,646 | 2026-06-27 | MIT | Hold. Useful for Instagram metadata/media, but unofficial and login-sensitive. |
| TikTok-Api | https://github.com/davidteather/TikTok-Api | 6,467 | 2026-06-27 | MIT | Hold. Unofficial and more fragile; avoid until public research is insufficient. |
| browser-use | https://github.com/browser-use/browser-use | 100,968 | 2026-06-27 | MIT | Hold. Powerful but heavier than needed while OpenClaw/Playwright covers basic work. |
| agent-browser | https://github.com/vercel-labs/agent-browser | 37,349 | 2026-06-27 | Apache-2.0 | Watch. Promising AI-browser CLI, but new/heavy; not needed for this first funnel pass. |

## Installed Locally

Installed into:

`projects/carplayradiohub-site/research-tools/.venv`

Packages:

- `yt-dlp==2026.6.9`
- `gallery-dl==1.32.4`

Wrapper scripts:

- `scripts/video-metadata.ps1`
- `scripts/gallery-metadata.ps1`

## Usage

```powershell
.\scripts\video-metadata.ps1 -Url "https://www.youtube.com/watch?v=..."
.\scripts\video-metadata.ps1 -Url "https://www.youtube.com/watch?v=..." -OutputPath ".\research\video.json"
.\scripts\gallery-metadata.ps1 -Url "https://example.com/public-gallery-url"
```

## Boundaries

- Use public URLs and metadata first.
- Do not bypass logins, captchas, rate limits, or platform protections.
- Do not download or reuse creator videos as assets without permission.
- Use findings for hooks, offer language, and pattern recognition, not content theft.
