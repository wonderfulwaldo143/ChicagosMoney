# Formspree Setup - Chicago's Money Email Notifications

## Quick Setup (2 minutes, completely free)

### Option 1: Using Formspree (Recommended - 50 submissions/month free)

1. **Go to [Formspree.io](https://formspree.io)**

2. **Sign in with wonderfulwaldo@gmail.com**
   - Click "Sign in" → "Continue with Google"
   - Use wonderfulwaldo@gmail.com account

3. **Create a New Form**
   - Click "New Form" button
   - Name it: "Chicago Money Signups"
   - Leave other settings as default

4. **Copy Your Form ID**
   - After creating, you'll see a form endpoint like:
   - `https://formspree.io/f/xyzabc123`
   - Copy just the ID part: `xyzabc123`

5. **Update Your Website**
   - Open `index.html`
   - Find this line: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual form ID
   - Save the file

6. **That's it!** All emails will go directly to wonderfulwaldo@gmail.com

---

### Option 2: Alternative Free Services

If you prefer a different service, here are other free options:

**Getform.io** (50 submissions/month free)
- Sign up at https://getform.io
- Create form, copy endpoint
- Replace form action with: `https://getform.io/f/YOUR_FORM_ID`

**Web3Forms** (250 submissions/month free)
- Go to https://web3forms.com
- No signup required!
- Get access key instantly
- Replace form action with: `https://api.web3forms.com/submit`
- Add hidden input: `<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">`

**Netlify Forms** (100 submissions/month free)
- Only works if hosting on Netlify
- Just add `netlify` attribute to form tag
- Emails go to your Netlify account email

---

## How It Works

When someone submits their email:
1. Form sends data to Formspree
2. Formspree instantly emails wonderfulwaldo@gmail.com
3. Email includes subscriber's email and signup timestamp
4. Backup copy saved in browser localStorage

## Testing Your Setup

1. Open your website
2. Enter test email: `test@example.com`
3. Click "Notify Me"
4. Check wonderfulwaldo@gmail.com inbox (might take 30 seconds)
5. You should receive an email with the subscriber info

## Viewing Stored Emails (Backup)

Even without any service configured, emails are saved locally:

1. Open your website
2. Press F12 (open browser console)
3. Type: `JSON.parse(localStorage.getItem('email_signups'))`
4. Press Enter to see all collected emails

## Email Format You'll Receive

```
Subject: New Chicago Money Subscriber

New subscriber for Chicago's Money: user@example.com
Signup date: 12/30/2024, 3:45:12 PM
```

## Troubleshooting

- **No email received**: Check spam folder
- **"Something went wrong" error**: Verify form ID is correct
- **Form not working**: Make sure you replaced YOUR_FORM_ID with actual ID

## Benefits of Formspree

✅ No server needed  
✅ Works with static sites  
✅ Instant email notifications  
✅ Spam protection built-in  
✅ See all submissions in dashboard  
✅ Export to CSV anytime  
✅ 50 free submissions/month  

## Support

- Formspree Docs: https://help.formspree.io/
- Dashboard: https://formspree.io/forms