# CarPlay QA - 2026-06-27

## Environment

- Preview URL: `http://127.0.0.1:4173`
- Tooling: Microsoft Playwright MCP
- Viewports checked:
  - Desktop full page
  - Mobile 390 x 844

## Changes Made

- Replaced internal-facing checkout copy with customer-facing trust language.
- Added inline SVG favicon to stop the `/favicon.ico` 404.
- Tightened meta description around fitment-first ordering and timely same-day shipping.
- Fixed mobile fitment form interaction:
  - Exact make/model matches no longer leave suggestion menus open over the submit button.
  - Fitment form has extra mobile bottom padding.
  - Mobile sticky CTA container no longer blocks page interactions outside its buttons.

## Verified

- Production build passes.
- `npm audit --audit-level=moderate` reports `0 vulnerabilities`.
- Playwright reload after favicon fix showed no console errors.
- Jotform iframe loads inside checkout and exposes fields:
  - Full Name
  - Email Address
  - Phone Number
  - Vehicle Make
  - Vehicle Model
  - Vehicle Year
  - Vehicle Trim
  - Additional Notes or Questions
- Fitment flow passes on mobile:
  - Year: `2005`
  - Make: `Volkswagen`
  - Model: `Jetta GLI`
  - Result: `Good news, your vehicle is a valid fit.`

## Screenshots

- `operator-workspace/browser-qa/carplay-home-desktop-2026-06-27.png`
- `operator-workspace/browser-qa/carplay-home-mobile-2026-06-27.png`
- `operator-workspace/browser-qa/carplay-fitment-pass-mobile-2026-06-27.png`
- `operator-workspace/browser-qa/carplay-mobile-postfix-2026-06-27.png`

## Remaining Launch Blockers

- Confirm the Stripe payment link is the correct $109.99 product.
- Confirm Jotform submissions go to the right destination.
- Add real product, package, install, and screen-demo photos.
- Decide whether checkout should remain form-first, then payment, or require manual fitment approval before payment.
