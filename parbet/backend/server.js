require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const admin = require('firebase-admin');

/**
 * GLOBAL REBRAND: Booknshow Identity Application (Backend Server)
 * Enforced Colors: #FFFFFF, #E7364D, #333333, #EB5B6E, #FAD8DC, #A3A3A3, #626262
 * FEATURE: 100% Free Custom OTP Password Reset Architecture (No Meta/No OTPless)
 */

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'Booknshow <onboarding@resend.dev>'; 

// Temporary In-Memory OTP Store (Production note: Use Redis for horizontal scaling)
const otpStore = new Map();

try {
    const serviceAccount = require('./firebaseServiceAccount.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Booknshow Firebase Admin SDK initialized successfully.");
} catch (error) {
    console.error("FATAL: Failed to initialize Firebase Admin.", error);
}

// ============================================================================
// HTML EMAIL TEMPLATE BUILDERS
// ============================================================================

const buildOTPEmail = (otp) => `
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
        .otp-box { background-color: #FAD8DC; color: #E7364D; font-size: 36px; font-weight: 900; padding: 20px; border-radius: 8px; margin: 20px 0; letter-spacing: 8px; border: 2px dashed #E7364D; }
        .footer { background-color: #FAFAFA; padding: 20px; text-align: center; border-top: 1px solid rgba(163,163,163,0.2); font-size: 12px; color: #A3A3A3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1 class="logo-text">book<span class="logo-n">n</span>show</h1></div>
        <div class="content">
            <h2 style="margin-top:0;">Secure Access Code</h2>
            <p style="color:#626262;">Use the following 6-digit code to verify your identity and reset your password. This code expires in 10 minutes.</p>
            <div class="otp-box">${otp}</div>
            <p style="font-size:12px; color:#A3A3A3;">If you did not request this, please secure your account immediately.</p>
        </div>
        <div class="footer">&copy; 2026 Booknshow Secure Marketplace.</div>
    </div>
</body>
</html>
`;

// ============================================================================
// API ROUTES
// ============================================================================

app.get('/ping', (req, res) => res.status(200).send('Booknshow Server Active'));

// NEW ROUTE: Send OTP for Password Reset
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email strictly required.' });

    try {
        // Verify user exists in Firebase first
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Generate secure 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP with 10-minute expiry
        otpStore.set(email, { otp, expires: Date.now() + 600000 });

        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `${otp} is your Booknshow Reset Code`,
            html: buildOTPEmail(otp)
        });

        res.status(200).json({ success: true, message: 'OTP dispatched successfully.' });
    } catch (error) {
        console.error("OTP Dispatch Error:", error);
        res.status(404).json({ error: 'User account not found.' });
    }
});

// NEW ROUTE: Verify OTP and Force Password Update
app.post('/verify-and-reset', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    const record = otpStore.get(email);

    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(400).json({ error: 'Invalid or expired OTP code.' });
    }

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Use Admin SDK to forcefully update password (God-Mode)
        await admin.auth().updateUser(userRecord.uid, {
            password: newPassword
        });

        // Clear OTP after successful reset
        otpStore.delete(email);

        res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        console.error("Password Update Error:", error);
        res.status(500).json({ error: 'Failed to update password.' });
    }
});

// LEGACY ROUTES (Keep Existing)
app.post('/send-verification', async (req, res) => {
    const { email, redirectUrl } = req.body;
    try {
        const link = await admin.auth().generateEmailVerificationLink(email, { url: redirectUrl });
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Verify your Booknshow Account',
            html: `<p>Click here to verify: ${link}</p>` // Use previous styled templates here
        });
        res.status(200).json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Booknshow Backend Active on ${PORT}`));