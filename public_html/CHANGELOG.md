# Changelog

All notable changes to Chicago's Money website will be documented in this file.

## [Unreleased]

### Added
- Dedicated `salary-lookup.html` experience featuring the full salary lookup widget with tailored hero, feature highlights, and live Socrata integration.
- Homepage hero CTA and promotional card now direct visitors to the salary lookup lab.

### Changed
- Updated navigation across active pages to point to the new salary lookup destination instead of in-page anchors.

## [2025-09-10]

### Added
- Premium hero treatment with mesh-gradient backdrop, live status badge, and mixed-font typography.
- Magnetic hover/motion-based micro-interactions powered by Motion One for CTAs, presets, stats, and salary rows.
- Gradient-rich card styling for the salary search results, including alternating row backgrounds and elevated shadows.
- New `/budget-dashboard.html` interactive page with live payroll, overtime, and department analytics cards backed by Socrata queries and Chart.js visualizations.
- `/api/snapshot` endpoint to generate branded PNG previews for dashboard stories plus toast feedback for share interactions.

### Changed
- Reset the salary search minimum to start at `0` so users can immediately dial in their own threshold.
- Reformatted salary table columns with fixed widths and nowrap handling for numeric fields to improve desktop legibility.
- Updated CTA/preset buttons to use new color gradients and glassmorphic accents for consistency with the refreshed hero.
- Bumped service worker cache version to deliver the new styling to returning visitors.
- Replaced the department bar chart with a lightweight insight stack (badges + table) for faster loads.


### Fixed
- Addressed salary table wrapping issues: desktop values now stay on a single line, while mobile cards stack labels/values cleanly without vertical text.
- Ensured mobile salary cards retain the previous readable layout after desktop adjustments by refining the breakpoint flex rules.

## [2025-09-09]

### Fixed
- Email signup form now working properly
  - Added missing `name="email"` attribute to email input field (required for form submission)
  - Connected form to Formspree with active form ID `xqadnqlb`
  - Form submissions now sent directly to wonderfulwaldo@gmail.com
  - Previously the form was missing the name attribute which prevented submissions

### Form Configuration
- **Formspree Form ID**: `xqadnqlb`
- **Recipient Email**: wonderfulwaldo@gmail.com
- **Form Endpoint**: https://formspree.io/f/xqadnqlb
- **Status**: ✅ Active and working

## Previous Features (Already Implemented)

### Landing Page
- Static HTML landing page with "Coming Soon" message for 2025 launch
- Chicago skyline SVG animation with Willis Tower and iconic buildings
- Golden particle effects that flow toward "Money" text elements
- Email collection system for early access signups
- Mobile-responsive design with glassmorphic effects

### Business Intelligence Section
- 6 data report offerings for B2B customers
- Pricing tiers: Corridor Intel ($29), Industry Feed ($99), Enterprise Dashboard ($299)
- Sample report types: New Business Leads, Construction Permits, Health Violations, etc.

### Visual Design
- Deep blue gradient (#000814 to #1e3a8a) representing Lake Michigan
- Gold accents (#fbbf24) with shimmer effects on "Money" text
- Green glowing dollar sign in logo
- Parallax scrolling effects on skyline layers
- 3D tilt effects on feature cards
