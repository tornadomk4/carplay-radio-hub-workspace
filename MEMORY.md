# MEMORY.md - Long-Term Memory

## Frank

Frank Petrone lives in Secaucus, New Jersey, and graduated from Montclair State University with a degree in economics. He has a 125 lb pitbull named Eazy.

Frank likes fishing, snowboarding, playing on his computer, cars, cannabis/dabs, fashion and streetwear such as Stussy, Supreme, and ASSC, and Pokemon cards/sealed boxes.

## Work And Income

Frank sells aftermarket CarPlay radios through Meta ads and currently closes deals through DMs rather than a website. His Instagram handle is `tornado_mk4`, centered around his 2005 MK4 Jetta GLI, with reels, stories, relatable car content, and related posts.

Frank's major goal is to grow online revenue and create new income streams while minimizing manual work from him. He wants proactive planning and execution.

Frank has worked since age 14 as a Zamboni driver and ice rink manager. After graduating college, he wants to build online revenue and pursue a career job.

Potential income paths to explore include the radio sales business, car content, cannabis/dab content with a Dr. Dabber e-rig, fashion/streetwear, Pokemon cards/collectibles, and other low-labor online revenue systems.

Frank would be open to a career job in finance, sales, marketing, or the cannabis industry, ideally something that aligns with his economics degree, selling experience, and interests.

Frank is comfortable being fairly public with weed/cannabis content because his car account is not strongly linked to his identity.

## Operating Preferences

Frank wants autonomy and does not want to be asked for permission constantly. The assistant should be proactive, execution-oriented, and focused on helping him make money and reduce busywork.

Frank wants the assistant to act more like a human employee than a passive chatbot: lead with answers, generate ideas independently, create sites and local/self-hosted tools, update memories, propose reusable skills from repeated workflows, and ask itself productive strategy questions.

Frank explicitly wants obstacle recovery as a default behavior: when errors, missing tools, stale configs, failed commands, or other blockers appear, the assistant should diagnose, find practical workarounds, continue the task when safely possible, and record lessons instead of stopping at the failure.

Preserve hard safety boundaries: ask before spending money, public posts, messages sent as Frank, purchases, commitments, legal/regulated actions, irreversible/destructive actions, or anything that could create real-world risk.

Frank wants to revisit CarPlay video metrics soon and use them to decide what content and sales system to build next.

## CarPlay Radio Business Metrics

As of 2026-06-27, Frank's current Instagram/Meta radio funnel data: one reel has 18,500 views, 12,239 reach, and 609 interactions: 451 likes, 60 comments, 43 saves, and 37 shares. The ad stats on that same reel show 3,730 views, 2,395 reach, 42 message conversations started, $30 total spend, and roughly 5 or 6 radios sold.

Radios cost $62.99 and usually sell for $110-$140. They are shipped directly from Amazon with free shipping and no additional fulfillment cost. Frank supports all vehicles by using a universal double DIN radio plus the buyer's specific bezel and wiring harness adapter, also ordered from Amazon and shipped directly to the customer.

Common DM questions are whether the radio is plug and play, whether it will work for the buyer's car, and other simple fitment questions. The sales system should reduce repeated DM labor with a fitment/FAQ/qualification flow.

## Lessons Learned

Frank gave critical feedback on 2026-06-27:
- **Be proactive, not reactive.** Don't wait for Frank to ask — anticipate what needs to be done and do it. Constantly reverse-prompt myself: "What must the next thing be?"
- **Verify before reporting.** The dashboard had a port conflict (Docker on 8080), the embed was blank — I should catch these before saying "done."
- **Git commits need config.** Always set `user.name` and `user.email` before committing — Frank had "tornadomk4" as username on this machine.
- **GitHub tokens need correct scopes.** Fine-grained tokens need Contents + Pull requests + Issues permissions, not just Metadata.
- **MCP configs need correct package names.** `@modelcontextprotocol/server-fetch` doesn't exist — it's bundled in the SDK. `@modelcontextprotocol/server-time` doesn't exist standalone. Verify before adding.
- **Canvas requires paired nodes.** The canvas embed feature only works with paired Mac/iOS/Android nodes, not webchat. Don't try to force it.
- **Be concise and assertive.** Don't repeat yourself, don't loop, don't narrate every tool calls. Frank values speed and results.
- **Search the web for solutions.** When stuck, search online for similar issues. The internet is full of answers — use them. Don't guess when you can find the real solution in 30 seconds.
- **Verify git config before pushing.** Always set `user.name` and `user.email` per-repo before committing/pushing.
- **GitHub token may get truncated in logs.** Store the full token securely; partial tokens cause auth failures on push.
- **config.patch can fail silently with complex nested JSON.** For critical changes, write directly to the config file.
- **MCP servers in OpenClaw are consumed by Codex/ACP runtime, not native OpenClaw.** Use built-in tools (browser, web_fetch, exec) as equivalents.

## Operator Setup

Frank gave full permission to install and run Microsoft Playwright MCP for more autonomous browser work. Playwright MCP is configured as `playwright` in both the active OpenClaw Codex home and regular Codex home, using `npx.cmd @playwright/mcp@latest --browser chrome` with output files under `C:\Users\frank\.openclaw\workspace\operator-workspace\playwright-mcp\outputs`. The tool may require a host/session reload before it appears in the live tool list.

Circuit created `C:\Users\frank\.openclaw\workspace\operator-workspace` as a persistent execution bench with lanes for Playwright MCP, browser QA, market watch, content lab, and funnel ops. Frank approved the `playwright-operator-ops` skill, so use it for browser QA and funnel research. Chrome DevTools MCP is also installed as `chrome-devtools` in both Codex homes with usage stats disabled; it may require a host/session reload before tools appear live.

On 2026-06-27, Circuit used Playwright MCP to QA the CarPlay Radio Hub preview, fixed customer-facing checkout copy, added a favicon, fixed mobile fitment form blockers, and verified the 2005 Volkswagen Jetta GLI fitment path. QA artifacts live under `operator-workspace/browser-qa/`.

## TTS/STT And Home Automation

- TTS: Google Gemini TTS working (via built-in `tts` tool). Edge TTS installed as fallback.
- STT: Telegram voice messages natively transcribed. Windows built-in STT at `tools/stt.ps1`.
- Talk mode: NOT working. Requires a native audio model (Gemini/OpenAI), not text-only LLMs like owl-alpha. The seamless voice pipeline (Telegram voice → text transcription → owl-alpha reply → TTS voice back) works instead.
- Local Ollama models configured as fallback: qwen3.5-2b (1.3GB) and gemma-4-e2b-it (3.1GB)
- Philips Hue: Skill created at `skills/philips-hue/`. Bridge IP 192.168.1.151, API key obtained, 6 bedroom lights (IDs: 5, 10, 11, 12, 13, 14). Controller: `skills/philips-hue/hue.ps1`.
- Circuit Dashboard: `tools/circuit-dashboard/server.js` on port 8081. Activity log at `activityLog.json`.

## New Tools Installed (2026-06-28)

- **gog** (v0.31.1): Google Workspace CLI — Gmail, Calendar, Drive, Sheets, Docs. Needs OAuth setup (`gog auth add tornado.jetta@gmail.com`).
- **himalaya** (v1.2.0): IMAP/SMTP email CLI — raw email access.
- **GH_TOKEN**: Stored in user environment variable for persistent GitHub access.
- **Ollama fallback**: If OpenRouter goes down, OpenClaw falls back to local qwen3.5-2b model.
