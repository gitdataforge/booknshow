require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const admin = require('firebase-admin');

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Backend Server)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE 1: Secure Express Server Initialization
 * FEATURE 2: Firebase Admin SDK Integration (God-Mode Link Generation)
 * FEATURE 3: Resend API Custom Delivery Engine
 * FEATURE 4: Production-Grade HTML Email Templates (Injected inline)
 * FEATURE 5: Render.com Keep-Alive Ping Route
 */

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Resend
// Note: In production, change the "from" email to your verified domain (e.g., support@booknshow.com)
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Booknshow <onboarding@resend.dev>'; 

// Initialize Firebase Admin
// This requires the firebaseServiceAccount.json file to be present in the root of the backend folder
try {
    const serviceAccount = require('./firebaseServiceAccount.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Booknshow Firebase Admin SDK initialized successfully.");
} catch (error) {
    console.error("FATAL: Failed to initialize Firebase Admin. Ensure firebaseServiceAccount.json is present.", error);
}

// ============================================================================
// HTML EMAIL TEMPLATE BUILDERS (Injecting High-End UI into Email Payloads)
// ============================================================================

const buildVerificationEmail = (link) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F5F5F5; margin: 0; padding: 0; }
        .container { max-w-[600px]; margin: 40px auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(51,51,51,0.1); border: 1px solid rgba(163,163,163,0.2); }
        .header { background-color: #333333; padding: 30px; text-align: center; }
        .logo-text { font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -1px; margin: 0; }
        .logo-n { color: #E7364D; }
        .content { padding: 40px 30px; text-align: center; color: #333333; }
        .title { font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 20px; }
        .text { font-size: 15px; line-height: 1.6; color: #626262; margin-bottom: 30px; font-weight: 500; }
        .button { display: inline-block; background-color: #E7364D; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: bold; padding: 16px 32px; border-radius: 8px; margin-bottom: 30px; }
        .footer { background-color: #FAFAFA; padding: 20px; text-align: center; border-top: 1px solid rgba(163,163,163,0.2); font-size: 12px; color: #A3A3A3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo-text">book<span class="logo-n">n</span>show</h1>
        </div>
        <div class="content">
            <h2 class="title">Verify Your Identity</h2>
            <p class="text">Welcome to the world's most secure event marketplace. Please click the button below to authenticate your email address and activate your Booknshow account.</p>
            <a href="${link}" class="button">Verify Email Address</a>
            <p class="text" style="font-size: 13px; margin-bottom: 0;">If you did not request this verification, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            &copy; 2026 Booknshow Secure Marketplace. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

const buildResetEmail = (link) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F5F5F5; margin: 0; padding: 0; }
        .container { max-w-[600px]; margin: 40px auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(51,51,51,0.1); border: 1px solid rgba(163,163,163,0.2); }
        .header { background-color: #333333; padding: 30px; text-align: center; }
        .logo-text { font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -1px; margin: 0; }
        .logo-n { color: #E7364D; }
        .content { padding: 40px 30px; text-align: center; color: #333333; }
        .title { font-size: 24px; font-weight: 900; margin-top: 0; margin-bottom: 20px; }
        .text { font-size: 15px; line-height: 1.6; color: #626262; margin-bottom: 30px; font-weight: 500; }
        .button { display: inline-block; background-color: #333333; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: bold; padding: 16px 32px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #333333; }
        .footer { background-color: #FAFAFA; padding: 20px; text-align: center; border-top: 1px solid rgba(163,163,163,0.2); font-size: 12px; color: #A3A3A3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo-text">book<span class="logo-n">n</span>show</h1>
        </div>
        <div class="content">
            <h2 class="title">Password Reset Request</h2>
            <p class="text">We received a request to securely reset the password for your Booknshow account. Click the button below to establish new credentials.</p>
            <a href="${link}" class="button">Reset Password</a>
            <p class="text" style="font-size: 13px; margin-bottom: 0; color: #E7364D;">This link will expire soon for your security.</p>
        </div>
        <div class="footer">
            &copy; 2026 Booknshow Secure Marketplace. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

// ============================================================================
// API ROUTES
// ============================================================================

// FEATURE 5: Keep-Alive Ping (For cron-job.org)
app.get('/ping', (req, res) => {
    res.status(200).send('Booknshow Server Active');
});

// ROUTE: Generate and Send Verification Email
app.post('/send-verification', async (req, res) => {
    const { email, redirectUrl } = req.body;

    if (!email || !redirectUrl) {
        return res.status(400).json({ error: 'Email and redirectUrl are strictly required.' });
    }

    try {
        const actionCodeSettings = {
            url: redirectUrl,
            handleCodeInApp: true,
        };

        const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Verify your Booknshow Account',
            html: buildVerificationEmail(link)
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Verification Dispatch Error:", error);
        res.status(500).json({ error: 'Failed to generate and dispatch verification link.' });
    }
});

// ROUTE: Generate and Send Password Reset Email
app.post('/send-reset', async (req, res) => {
    const { email, redirectUrl } = req.body;

    if (!email || !redirectUrl) {
        return res.status(400).json({ error: 'Email and redirectUrl are strictly required.' });
    }

    try {
        const actionCodeSettings = {
            url: redirectUrl,
            handleCodeInApp: true,
        };

        const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Booknshow Password Reset',
            html: buildResetEmail(link)
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Password Reset Dispatch Error:", error);
        res.status(500).json({ error: 'Failed to generate and dispatch reset link.' });
    }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Booknshow Resend Backend successfully executing on port ${PORT}`);
});