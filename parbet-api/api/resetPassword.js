const { Resend } = require('resend');
const admin = require('firebase-admin');

// Initialize Firebase Admin strictly using environment variables
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * PARBET SECURE PASSWORD RECOVERY GATEWAY
 * Purpose: Handles cross-origin recovery requests and dispatches branded emails via Resend.
 * Logic: Strictly enforces CORS compliance to resolve Access-Control-Allow-Origin errors.
 */
export default async function handler(req, res) {
    // 1. DYNAMIC CORS INFRASTRUCTURE
    // This allows the GitHub Dev environment and production domains to communicate with the API.
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // 2. PREFLIGHT INTERCEPTOR
    // Immediately resolves the OPTIONS request sent by browsers during cross-origin fetch.
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. METHOD VALIDATION
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address is required.' });
        }

        // 4. FIREBASE ADMIN LINK GENERATION
        // Generates a secure, expiring reset link from the Parbet Firebase Auth instance.
        const resetLink = await admin.auth().generatePasswordResetLink(email, {
            url: 'https://parbet-seller.web.app/login' // Redirect target after reset
        });

        // 5. TRANSACTIONAL EMAIL DISPATCH (RESEND)
        // Uses the real Resend API key from .env to send a professional recovery email.
        const { data, error } = await resend.emails.send({
            from: 'Parbet Security <security@antespirit.com>',
            to: [email],
            subject: 'Reset your Parbet Seller Password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e2e2; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #1a1a1a; font-weight: 900; letter-spacing: -1px;">Password Reset Request</h2>
                    <p style="color: #54626c; font-size: 16px; line-height: 1.5;">We received a request to reset the password for your Parbet Seller account. Click the button below to proceed.</p>
                    <div style="margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">Reset Password</a>
                    </div>
                    <p style="color: #9ca3af; font-size: 12px;">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
                    <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
                    <p style="color: #54626c; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">&copy; 2026 Parbet Enterprise Marketplace</p>
                </div>
            `
        });

        if (error) {
            console.error("[Parbet API] Resend Error:", error);
            throw new Error("Failed to dispatch recovery email.");
        }

        return res.status(200).json({ 
            success: true, 
            message: 'A secure recovery link has been dispatched to your email.' 
        });

    } catch (error) {
        console.error("[Parbet API] Password Reset Failure:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error during password recovery.' 
        });
    }
}