# TOOLS.md - Local Notes

## CLI Tools (full paths required — PATH doesn't persist)

| Tool | Path | Purpose |
|------|------|---------|
| node | `node` | JavaScript runtime |
| npm | `npm` | Package manager |
| git | `git` | Version control |
| python | `python` | Python runtime |
| pip | `pip` | Python packages |
| curl | `curl` | HTTP requests |
| winget | `winget` | Windows package manager |
| gog | `C:\Users\frank\AppData\Local\Microsoft\WinGet\Packages\steipete.gogcli_Microsoft.Winget.Source_8wekyb3d8bbwe\gog.exe` | Google Workspace CLI |
| himalaya | `C:\Users\frank\.openclaw\bin\himalaya.exe` | IMAP/SMTP email |
| gh | `gh` | GitHub CLI |
| mcporter | `mcporter` (npm -g) | MCP server management |
| edge-tts | `edge-tts` (npm -g) | Microsoft Edge TTS |
| pm2 | `pm2` (npm -g) | Node.js process manager |
| playwright | `npx.cmd @playwright/mcp@latest --browser chrome` | Browser automation |

## Services

| Service | Address | Status |
|---------|---------|--------|
| OpenClaw Gateway | localhost:18789 | Running |
| Circuit Dashboard | http://127.0.0.1:8081 | Running (PM2) |
| Site Preview | http://127.0.0.1:4173 | Start with `npm run preview` |
| SearxNG | http://127.0.0.1:8080 | Running (Docker) |
| Ollama | http://127.0.0.1:11434 | Running |
| Philips Hue | 192.168.1.151 | Running |

## GitHub

- Repo: https://github.com/tornadomk4/carplay-radio-hub
- Token: stored in `$env:GH_TOKEN` (user environment variable)
- Branch: main

## Philips Hue

- Bridge IP: 192.168.1.151
- API key: saved in skills/philips-hue/config.json
- Bedroom lights: IDs 5, 10, 11, 12, 13, 14
- Controller: skills/philips-hue/hue.ps1

## Key File Locations

- Workspace: `C:\Users\frank\.openclaw\workspace`
- Operator workspace: `workspace/operator-workspace`
- Site project: `workspace/projects/carplayradiohub-site/carplayradiohub_site`
- Dashboard: `workspace/tools/circuit-dashboard/server.js`
- Activity log: `workspace/tools/circuit-dashboard/activityLog.json`
- Memory: `workspace/memory/`
- Skills: `workspace/skills/` and `~/.gemini/antigravity/scratch/openclaw/skills/`
