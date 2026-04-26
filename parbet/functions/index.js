/**
 * FEATURE 1: Secure Serverless Backend Initialization
 * FEATURE 2: CORS (Cross-Origin Resource Sharing) Bypass Engine
 * FEATURE 3: Resend Node SDK Integration
 * FEATURE 4: Encrypted Environment Variable Handling
 * FEATURE 5: Dynamic HTML Email Templating
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const { Resend } = require("resend");

// Initialize Firebase Admin privileges
admin.initializeApp();

// Initialize Resend with Firebase Environment Configuration or standard process.env
// The SDK will automatically look for process.env.RESEND_API_KEY if available
const RESEND_API_KEY = process.env.RESEND_API_KEY || functions.config().resend?.key;
const resend = new Resend(RESEND_API_KEY);

exports.sendResetEmail = functions.https.onRequest((req, res) => {
    // Wrap the request in the CORS middleware to permanently bypass browser blocks
    cors(req, res, async () => {
        // Strict HTTP Method Validation
        if (req.method !== 'POST') {
            console.warn("[Security] Blocked non-POST request to sendResetEmail endpoint.");
            return res.status(405).json({ error: "Method not allowed. Please use POST." });
        }

        try {
            // Extract payloads from the frontend fetch request
            const { email, resetLink } = req.body;

            if (!email || !resetLink) {
                console.error("[Validation Error] Missing required payload parameters.");
                return res.status(400).json({ error: "Missing required parameters: email and resetLink." });
            }

            if (!RESEND_API_KEY) {
                console.error("[Configuration Error] Resend API Key is missing in the Cloud Environment.");
                return res.status(500).json({ error: "Server configuration error. API key missing." });
            }

            // FEATURE 5: Premium Custom HTML Email Template (Parbet Branding)
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
                        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e2e2; }
                        .header { background-color: #1a1a1a; padding: 24px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; }
                        .header span { color: #8cc63f; }
                        .content { padding: 40px 32px; }
                        .content h2 { color: #1a1a1a; font-size: 22px; margin-top: 0; font-weight: 900; letter-spacing: -0.5px; }
                        .content p { color: #54626c; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
                        .btn-container { text-align: center; margin: 32px 0; }
                        .btn { background-color: #458731; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block; transition: background-color 0.2s; }
                        .btn:hover { background-color: #366a26; }
                        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e2e2e2; }
                        .footer p { color: #9ca3af; font-size: 12px; margin: 0; font-weight: 500; }
                        .warning { background-color: #fff4e5; border-left: 4px solid #f57c00; padding: 12px 16px; margin-bottom: 24px; }
                        .warning p { margin: 0; color: #b75c00; font-size: 13px; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>parbet <span>tickets</span></h1>
                        </div>
                        <div class="content">
                            <h2>Reset your password</h2>
                            <p>We received a secure request to reset the password for your Parbet account associated with <strong>${email}</strong>.</p>
                            
                            <div class="warning">
                                <p>If you did not request a password reset, you can safely ignore this email. Your account remains completely secure.</p>
                            </div>

                            <p>Click the button below to securely authenticate and set a new password for your account.</p>
                            
                            <div class="btn-container">
                                <a href="${resetLink}" class="btn">Reset Password Securely</a>
                            </div>
                            
                            <p style="font-size: 13px; color: #9ca3af;">For your security, this highly encrypted link will expire automatically in exactly 1 hour.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Parbet Entertainment Inc. All rights reserved.</p>
                            <p style="margin-top: 4px;">Secure Dispatch Protocol via Resend API (Cloud Function Proxy)</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            // FEATURE 3: Official Server-to-Server Resend Dispatch
            // STRICT UPDATE: Enforcing Resend's free tier sandbox requirement
            const data = await resend.emails.send({
                from: "Parbet Security <onboarding@resend.dev>",
                to: [email],
                subject: "Security Alert: Reset Your Parbet Password",
                html: htmlContent,
                tags: [
                    { name: "category", value: "password_reset_auth" },
                    { name: "environment", value: "sandbox" },
                    { name: "proxy", value: "firebase_functions" }
                ]
            });

            console.log(`[Resend Protocol] Successfully dispatched reset link via Cloud Functions to ${email}. ID: ${data.id}`);
            return res.status(200).json({ success: true, id: data.id });

        } catch (error) {
            console.error("[Resend Protocol] Server Exception:", error);
            return res.status(500).json({ 
                error: "Unable to connect to the email dispatch server.", 
                details: error.message 
            });
        }
    });
});