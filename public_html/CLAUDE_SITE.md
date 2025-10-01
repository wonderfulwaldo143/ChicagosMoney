# CLAUDE_SITE.md

> Formerly `public_html/CLAUDE.md`; paths updated for repository-root web files in September 2025.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chicago's Money is a static HTML landing page for a website that tracks Chicago's public spending. The site's core tagline is "Where Does All The Money Go?" and aims to provide transparency about city expenditures.

## Project Structure

This is a simple static website with:
- `index.html` - Main landing page with hero section, email signup form, features, and Chicago skyline theming
- `styles.css` - Styling with animated Chicago skyline, glassmorphic effects, particle animations, and responsive design
- `script.js` - JavaScript for animations, particle effects, form handling, and email collection
- `FORMSPREE_SETUP.md` - Instructions for activating email notifications

## Key Design Elements

- **Chicago Skyline**: Accurate SVG-based skyline with Willis Tower, Marina City, and other iconic buildings
- **Color Scheme**: Deep blue gradient (#000814 to #1e3a8a) representing Lake Michigan at night
- **Gold Accents**: "Money" text in bright gold (#fbbf24) with shimmer effects
- **Green Dollar Sign**: Glowing green ($) symbol in the logo
- **Particle System**: Golden particles that flow upward and curve toward the "Money" text elements
- **Typography**: Inter and Bebas Neue fonts for modern, bold appearance
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px

## Email Collection System

### Current Status
- **Email form is functional** and collecting submissions locally in browser localStorage
- **Formspree integration ready** but not yet activated (needs form ID)
- All email submissions are being saved and can be retrieved

### To Activate Email Notifications (2-minute setup):
1. Go to https://formspree.io
2. Sign in with wonderfulwaldo@gmail.com
3. Create new form called "Chicago Money Signups"
4. Copy the form ID (looks like: xyzabc123)
5. In `index.html`, replace `YOUR_FORM_ID` with the actual ID
6. Emails will then be sent to wonderfulwaldo@gmail.com automatically

### Retrieving Locally Stored Emails:
To see all collected emails (before Formspree is set up):
1. Open the website in a browser
2. Open console (F12)
3. Run: `JSON.parse(localStorage.getItem('email_signups'))`
4. Copy the list of emails with timestamps

## Development Commands

Since this is a static HTML site, no build process is required. To view the site:
- Open `index.html` directly in a browser
- Or use a local server: `python3 -m http.server 8000` or `npx serve`

## Animation Features

- Loading screen with pulsing dollar sign
- Particles and money symbols flowing toward "Money" text
- Parallax skyline layers that respond to mouse movement
- Word-by-word reveal animation for tagline
- Glowing hover effects on all interactive elements
- 3D tilt effect on feature cards

## Future Development Considerations

The landing page is currently a "Coming Soon" placeholder launching in 2025. When expanding to a full application:
- Activate Formspree to receive email notifications (see instructions above)
- Integrate with Chicago's public spending data APIs
- Consider adding a build process if using a framework (React, Vue, etc.)
- The three feature sections (Transparent Data, Deep Insights, Stay Informed) indicate the main functionality to be implemented
- Export collected emails from localStorage or Formspree dashboard before launching
