const admin = require('firebase-admin');
const { Resend } = require('resend');
const cors = require('cors')({ origin: true });

/**
 * FEATURE 1: Secure Firebase Admin Initialization (Cold-Start Optimized)
 * Security: Credentials pulled strictly from encrypted Vercel Environment Variables.
 */
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("CRITICAL: Firebase Admin Initialization Failed. Check FIREBASE_SERVICE_ACCOUNT format.");
    }
}

/**
 * FEATURE 2: Resend SDK Sandbox Initialization
 */
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    // Handle Cross-Origin Resource Sharing (CORS) for Parbet Frontend Apps
    cors(req, res, async () => {
        
        // FEATURE 3: Strict Method Guard
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed. This endpoint strictly requires a POST request.' });
        }

        const { email, name } = req.body;

        // FEATURE 4: Input Validation
        if (!email) {
            return res.status(400).json({ error: 'Email address is required to process the verification request.' });
        }

        try {
            /**
             * FEATURE 5: Generate Secure Verification Link
             * Uses the Admin SDK to create the official OOB (Out-Of-Band) verification code.
             */
            const verificationLink = await admin.auth().generateEmailVerificationLink(email);
            const appName = "Parbet";
            const displayName = name || "Seller";

            /**
             * FEATURE 6: Enterprise 11-Section HTML Template with Animations
             * Fully responsive, branded design with CSS animations built for modern email clients.
             */
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* CSS Animations for Email Clients that support it */
                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(140, 198, 63, 0.4); }
                        70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(140, 198, 63, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(140, 198, 63, 0); }
                    }
                    .cta-button {
                        animation: pulse 2s infinite;
                        transition: background-color 0.3s ease;
                    }
                    .cta-button:hover { background-color: #366a26 !important; }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                
                <!-- SECTION 1: Invisible Preheader for Inbox Preview -->
                <div style="display: none; max-height: 0px; overflow: hidden;">Verify your ${appName} seller account to activate your dashboard and start listing tickets.</div>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 40px 20px;">
                    <tr>
                        <td align="center">
                            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.04); max-width: 600px; margin: 0 auto;">
                                
                                <!-- SECTION 2: Dynamic Brand Header -->
                                <tr>
                                    <td align="center" style="padding: 35px 20px; border-bottom: 4px solid #8cc63f; background-color: #ffffff;">
                                        <h2 style="margin: 0; font-size: 42px; font-weight: 900; letter-spacing: -2px;">
                                            <span style="color: #54626c;">par</span><span style="color: #8cc63f;">bet</span>
                                        </h2>
                                    </td>
                                </tr>

                                <!-- SECTION 3: Hero Announcement -->
                                <tr>
                                    <td align="center" style="padding: 45px 40px 15px;">
                                        <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Activate Your Account</h1>
                                    </td>
                                </tr>

                                <!-- SECTION 4: Contextual Welcome -->
                                <tr>
                                    <td style="padding: 10px 40px 25px;">
                                        <p style="color: #1a1a1a; font-size: 16px; line-height: 1.6; margin-bottom: 15px; font-weight: 600;">Welcome to ${appName}, ${displayName}!</p>
                                        <p style="color: #54626c; font-size: 16px; line-height: 1.7; margin-bottom: 0;">
                                            You are one step away from joining the world's most secure ticketing marketplace. Please verify your email address (<strong>${email}</strong>) to unlock your seller dashboard.
                                        </p>
                                    </td>
                                </tr>

                                <!-- SECTION 5: Primary Animated Call to Action -->
                                <tr>
                                    <td align="center" style="padding: 20px 40px 35px;">
                                        <a href="${verificationLink}" class="cta-button" style="background-color: #458731; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(69, 135, 49, 0.25);">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>

                                <!-- SECTION 6: Time Sensitivity & Security Warning -->
                                <tr>
                                    <td align="center" style="padding: 0 40px 25px;">
                                        <p style="color: #c21c3a; font-size: 13px; margin: 0; font-weight: 700; background-color: #fdf2f2; display: inline-block; padding: 8px 16px; border-radius: 20px;">
                                            &#9888; Security Link: Expires in 24 hours.
                                        </p>
                                    </td>
                                </tr>

                                <!-- SECTION 7: Fallback Raw URL Box -->
                                <tr>
                                    <td align="center" style="padding: 0 40px;">
                                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; border: 1px dashed #e2e2e2; word-break: break-all;">
                                            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; font-weight: 700; text-transform: uppercase;">Button not working? Copy this link:</p>
                                            <a href="${verificationLink}" style="color: #0064d2; font-size: 13px; text-decoration: underline; line-height: 1.5;">${verificationLink}</a>
                                        </div>
                                    </td>
                                </tr>

                                <!-- SECTION 8: Feature Highlight 1 - Secure Marketplace -->
                                <tr>
                                    <td style="padding: 40px 40px 10px;">
                                        <h3 style="color: #1a1a1a; font-size: 18px; margin: 0 0 10px;">🛡️ Secure Seller Guarantee</h3>
                                        <p style="color: #54626c; font-size: 14px; line-height: 1.6; margin: 0;">List your tickets with confidence. Our automated anti-fraud engine ensures every transaction is legitimate, protecting you from chargebacks.</p>
                                    </td>
                                </tr>

                                <!-- SECTION 9: Feature Highlight 2 - Fast Payouts -->
                                <tr>
                                    <td style="padding: 10px 40px 30px; border-bottom: 1px solid #f0f0f0;">
                                        <h3 style="color: #1a1a1a; font-size: 18px; margin: 0 0 10px;">💸 Lightning Fast Payouts</h3>
                                        <p style="color: #54626c; font-size: 14px; line-height: 1.6; margin: 0;">Once the event concludes, your funds are automatically cleared and routed directly to your connected bank account within 24-48 hours.</p>
                                    </td>
                                </tr>

                                <!-- SECTION 10: Disclaimer & False Request Handling -->
                                <tr>
                                    <td style="padding: 30px 40px 15px;">
                                        <p style="color: #1f2937; font-size: 13px; margin-bottom: 5px; font-weight: 700;">Didn't create this account?</p>
                                        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin-top: 0;">If you received this email by mistake, simply ignore it. The account will not be activated until this link is clicked.</p>
                                    </td>
                                </tr>

                                <!-- SECTION 11: Legal & Branding Footer -->
                                <tr>
                                    <td align="center" style="padding: 25px 40px 35px; background-color: #fafafa;">
                                        <p style="color: #111827; font-size: 14px; margin: 0 0 5px; font-weight: 600;">The ${appName} Onboarding Team</p>
                                        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                                            &copy; 2026 ${appName} Marketplace Technologies.<br>
                                            All rights reserved. Secure Global Ticketing.<br>
                                            <a href="#" style="color: #9ca3af; text-decoration: underline;">Privacy Policy</a> &nbsp;|&nbsp; <a href="#" style="color: #9ca3af; text-decoration: underline;">Terms of Service</a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            `;

            /**
             * FEATURE 7: Dispatch via Resend Sandbox Engine
             * MANDATORY: Because you are on the free tier with no domain, 'from' MUST be exactly 'onboarding@resend.dev'
             */
            const { data, error } = await resend.emails.send({
                from: 'Parbet Onboarding <onboarding@resend.dev>',
                to: [email],
                reply_to: 'support.parbet@outlook.com',
                subject: `Action Required: Verify your ${appName} Account`,
                html: htmlContent,
            });

            if (error) {
                console.error("Resend Sandbox Dispatch Error:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ 
                success: true, 
                message: '10+ Section Verification link dispatched successfully via Resend Sandbox.',
            });

        } catch (error) {
            console.error('Critical Verification API Failure:', error);
            return res.status(500).json({ error: 'Failed to process verification request.' });
        }
    });
};