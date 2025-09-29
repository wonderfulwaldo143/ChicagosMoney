# Google Tag Manager Setup Guide for Chicago's Money

## Current Status
- ✅ GTM Container ID: `GTM-PRX5GJ6W` (installed on all pages)
- ✅ GA4 Measurement ID: `G-WSXXL0P3ZG` (configured in GTM)
- ❌ **ISSUE**: No triggers configured (this is why tags aren't firing)

## Required Setup Steps

### 1. Create Triggers

#### Trigger 1: All Pages
- **Name**: `All Pages`
- **Type**: `Page View`
- **Configuration**: 
  - This trigger fires on: `All Pages`
- **Use for**: GA4 Configuration tag

#### Trigger 2: Page View
- **Name**: `Page View`
- **Type**: `Page View`
- **Configuration**:
  - This trigger fires on: `All Pages`
- **Use for**: GA4 Event tag

### 2. Configure GA4 Tags

#### GA4 Configuration Tag
- **Tag Name**: `GA4 Configuration`
- **Tag Type**: `Google Analytics: GA4 Configuration`
- **Measurement ID**: `G-WSXXL0P3ZG`
- **Trigger**: `All Pages`

#### GA4 Event Tag (Optional)
- **Tag Name**: `GA4 Page View`
- **Tag Type**: `Google Analytics: GA4 Event`
- **Configuration Tag**: `GA4 Configuration`
- **Event Name**: `page_view`
- **Trigger**: `Page View`

### 3. Step-by-Step Instructions

1. **Go to Google Tag Manager** (https://tagmanager.google.com)
2. **Select your container**: `GTM-PRX5GJ6W`
3. **Create Triggers**:
   - Click "Triggers" in left sidebar
   - Click "New" button
   - Name: "All Pages"
   - Type: "Page View"
   - Configuration: "All Pages"
   - Save
   - Repeat for "Page View" trigger

4. **Configure GA4 Tags**:
   - Click "Tags" in left sidebar
   - Click "New" button
   - Name: "GA4 Configuration"
   - Type: "Google Analytics: GA4 Configuration"
   - Measurement ID: `G-WSXXL0P3ZG`
   - Trigger: "All Pages"
   - Save

5. **Test Configuration**:
   - Click "Preview" button
   - Enter your website URL
   - Verify tags fire correctly

6. **Publish Changes**:
   - Click "Submit" button
   - Add version name: "GA4 Setup"
   - Publish

## Testing Checklist

### Local Testing
- [ ] Open `test-tracking.html` in browser
- [ ] Check browser console for errors
- [ ] Verify `window.dataLayer` exists
- [ ] Verify `gtag` function is available

### Live Site Testing
- [ ] Use GTM Preview mode
- [ ] Check Google Analytics Real-Time reports
- [ ] Use Google Tag Assistant extension
- [ ] Verify no JavaScript errors in console

## Common Issues & Solutions

### Issue: Tags not firing
**Solution**: Check that triggers are properly configured and assigned to tags

### Issue: GA4 not receiving data
**Solution**: Verify Measurement ID is correct (`G-WSXXL0P3ZG`)

### Issue: Multiple GTM installations
**Solution**: Ensure GTM code is only installed once per page

### Issue: Ad blockers preventing tracking
**Solution**: Test in incognito mode or disable ad blockers

## Verification Commands

Open browser console and run these commands:

```javascript
// Check if GTM is loaded
console.log('GTM loaded:', typeof window.dataLayer !== 'undefined');

// Check DataLayer
console.log('DataLayer:', window.dataLayer);

// Check GA4
console.log('GA4 loaded:', typeof gtag !== 'undefined');

// Check GTM container
console.log('GTM Container:', window.dataLayer[0]);
```

## Next Steps After Setup

1. **Monitor Analytics**: Check Google Analytics for incoming data
2. **Set up Goals**: Configure conversion tracking
3. **Add Enhanced Ecommerce**: If needed for business tracking
4. **Set up Custom Events**: Track specific user interactions

## Support Resources

- [Google Tag Manager Help](https://support.google.com/tagmanager)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GTM Debugging Guide](https://support.google.com/tagmanager/answer/6105163)
