# Mobile Experience Smoke Test

Use this checklist to validate the new mobile-first experience on real devices. Run each scenario on both iOS (Safari) and Android (Chrome) when possible.

## Environment Prep
- Clear browser cache or use a private window to avoid cached preferences.
- Have network connectivity available; Wi‑Fi plus LTE/5G helps expose loading states.
- Save any screenshots that deviate from the expected behaviour.

## Test Scenarios

### 1. Automatic Redirect
- **Steps**: Navigate to `https://chicagosmoney.com/` on a fresh session.
- **Expected**: Mobile browser redirects to `/mobile.html` before the hero paints.
- **Notes**: If you previously opted into the desktop view, clear the preference from Safari/Chrome storage or visit `/mobile.html?view=mobile`.

### 2. Desktop Opt-Out
- **Steps**: From `mobile.html`, use the “Desktop site” button (bottom dock or menu).
- **Expected**: Preference stored, page opens the desktop home with `view=desktop` cleared from the URL.
- **Regression Check**: Reloading `https://chicagosmoney.com/` should stay on the desktop layout until the preference is cleared.

### 3. Return to Mobile
- **Steps**: On the desktop site, use the “Mobile” nav link (or hit `/mobile.html?view=mobile`).
- **Expected**: Desktop preference clears, and the mobile page opens without query strings.

### 4. Navigation Drawer
- **Steps**: Open the hamburger menu on `mobile.html`, interact with each link, dismiss via backdrop tap and Close button.
- **Expected**: Sheet animates smoothly, `body` scroll locks, and Escape key closes when a keyboard is attached.

### 5. Sticky Bottom Dock
- **Steps**: Scroll long content, ensure dock anchors stay affixed above the safe area inset.
- **Expected**: Buttons remain tappable, do not overlap with keyboard when focusing form fields (e.g., Contact link).

### 6. Safe Area Insets
- **Steps**: On iPhone (FaceID) and Pixel devices, observe top header padding and bottom dock spacing.
- **Expected**: Content respects notch and gesture areas; no clipping under status bars.

### 7. Performance Feel
- **Steps**: Scroll hero, stats carousel, and FAQ.
- **Expected**: No jank or noticeable layout shifts; background gradients should remain smooth.

### 8. Page Coverage
- **Steps**: Visit `/mobile-salary.html`, `/mobile-budget.html`, `/mobile-blog.html`, `/mobile-about.html`, and `/mobile-contact.html`.
- **Expected**: Each page loads with active nav highlighting, bottom dock present, and scoped content (search, stats, CTA) functioning. On salary lookup, run a query and download link to confirm Socrata connectivity.

## Observations
- _Status_: Not run in this environment (no device simulator). Use the checklist above during the next in-person QA pass and record results here.

## Follow-ups
- Capture screenshots of hero, nav, and bottom dock for iPhone 14 and Pixel 7 to add to the marketing kit once validated.
