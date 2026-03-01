# Staff Recognition Website

A modern browser-based staff recognition app where teachers can:

- Sign in with **Firebase Google Authentication**.
- Sign in only if the teacher email has already been added by the admin.
- Award points to other teachers for helping.
- Redeem earned points for prizes.
- View recognition and redemption history.
- Use an admin panel (admin users only) split into tabs for Teachers, Prizes, and Redemptions To Give.
- Support more than one admin by promoting/demoting teachers in Admin > Teachers.

## Points model

- **Bank points**: points each teacher can give to others.
- **Earned points**: points received from other teachers.
- Teachers can only redeem from **Earned points**.
- New teachers start with default **Bank points** (50 by default, or admin-configured value).

## Run locally (required for Firebase login)

Do **not** open `index.html` directly as a file. Firebase Google login requires a web app URL.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Firebase config for Netlify (works on every device)

The app reads Firebase config from `firebase-config.js` (deployed with the site), so every laptop/device gets the same config.

1. Open `firebase-config.js`.
2. Replace `REPLACE_ME` values with your Firebase **Web App** config.
3. Redeploy to Netlify.
4. In Firebase Auth settings, add your Netlify domain (and custom domain) to authorized domains.
5. Ensure Google sign-in is enabled in Firebase.
6. Enable **Cloud Firestore** (production or test mode) because approved teachers/admin roles are synced there for cross-device login.

## Admin email notifications for redemptions (Netlify)

This app now sends redemption email notifications through a Netlify Function:

- Function path: `netlify/functions/send-redemption-email.js`
- Client endpoint called: `/.netlify/functions/send-redemption-email`

Set these environment variables in Netlify:

- `RESEND_API_KEY` (or your configured provider key used in the function)
- `RESEND_FROM_EMAIL` (verified sender, e.g. `rewards@yourdomain.com`)
- `ADMIN_NOTIFICATION_EMAIL` (optional; defaults to `cfluit29@plymouthchristian.us`)

After setting env vars, redeploy the site.

## Dashboard navigation

- No prizes are preloaded by default; admins can add prizes in the Admin tab.
- After login, use the top tabs to move between Award Points, Redeem Prizes, Recognitions, Redemptions, and Admin.
- The Admin tab appears for any teacher marked as an admin.
- The admin email is auto-seeded on first run so the admin can always sign in and add other teachers.
- Teacher approvals/admin role updates sync to Firebase Firestore so sign-in permissions work across different computers.
- In Admin > **Teachers**, add teachers, edit each teacher, promote/demote admin role, and delete teachers.
- In Admin > **Prizes**, add, edit, and delete prizes.
- In Admin > **Redemptions To Give**, click the ✓ button once a redeemed prize is given to the teacher.

## Storage behavior

- Authentication is handled by Firebase.
- App data (teachers, bank/earned points, recognitions, prizes, settings, redemptions) is stored in browser `localStorage`.
