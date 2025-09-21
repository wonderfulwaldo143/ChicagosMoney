# Icons Directory

This directory should contain Progressive Web App (PWA) icons in various sizes.

## Required Icon Sizes

Create square PNG icons from your logo in the following sizes:

### Essential Icons (Minimum Required)
- `icon-72x72.png` - Android Chrome
- `icon-96x96.png` - Chrome Web Store
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Microsoft Store
- `icon-152x152.png` - Apple Touch Icon
- `icon-192x192.png` - Chrome Android (required)
- `icon-384x384.png` - Chrome splash screen
- `icon-512x512.png` - Chrome install banner (required)

### Additional Icons
- `favicon-16x16.png` - Browser favicon
- `favicon-32x32.png` - Browser favicon
- `favicon.ico` - Legacy browser support
- `apple-touch-icon.png` - Apple devices (180x180)
- `safari-pinned-tab.svg` - Safari pinned tab

## How to Generate Icons

### Option 1: Using Your Existing Logo
Copy your logo from `IMG/chicagos_money_logo_variant_1.png` and resize it.

### Option 2: Online Tools
- [RealFaviconGenerator.net](https://realfavicongenerator.net/) - Generates all sizes
- [Favicon.io](https://favicon.io/) - Simple favicon generator
- [PWA Asset Generator](https://pwa-asset-generator.firebaseapp.com/) - PWA specific

### Option 3: Command Line (ImageMagick)
```bash
# Install ImageMagick first
# Then run these commands:

# Generate various sizes from source image
convert IMG/chicagos_money_logo_variant_1.png -resize 72x72 icons/icon-72x72.png
convert IMG/chicagos_money_logo_variant_1.png -resize 96x96 icons/icon-96x96.png
convert IMG/chicagos_money_logo_variant_1.png -resize 128x128 icons/icon-128x128.png
convert IMG/chicagos_money_logo_variant_1.png -resize 144x144 icons/icon-144x144.png
convert IMG/chicagos_money_logo_variant_1.png -resize 152x152 icons/icon-152x152.png
convert IMG/chicagos_money_logo_variant_1.png -resize 192x192 icons/icon-192x192.png
convert IMG/chicagos_money_logo_variant_1.png -resize 384x384 icons/icon-384x384.png
convert IMG/chicagos_money_logo_variant_1.png -resize 512x512 icons/icon-512x512.png

# Generate favicon
convert IMG/chicagos_money_logo_variant_1.png -resize 32x32 icons/favicon-32x32.png
convert IMG/chicagos_money_logo_variant_1.png -resize 16x16 icons/favicon-16x16.png
convert icons/favicon-32x32.png icons/favicon-16x16.png icons/favicon.ico
```

### Option 4: Photoshop/GIMP
Manually resize and export each size with proper optimization.

## Icon Requirements

1. **Format**: PNG with transparency
2. **Color Space**: sRGB
3. **Optimization**: Compress with tools like TinyPNG
4. **Maskable**: Icons should work with circular masks (safe zone)
5. **Background**: Consider solid background for better visibility

## Testing Icons

1. **PWA**: Use Chrome DevTools > Application > Manifest
2. **Favicon**: Clear cache and reload to see favicon
3. **Mobile**: Add to home screen on Android/iOS
4. **Share**: Test social media sharing previews

## Current Status

⚠️ **Icons need to be generated from the main logo**

The manifest.json and HTML files are configured to use these icons.
Generate them to enable full PWA functionality.