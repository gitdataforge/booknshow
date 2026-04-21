// api/createOrder.js
const Razorpay = require('razorpay');

export default async function handler(req, res) {
    // Set CORS headers for secure cross-origin requests from the frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Strict method validation
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Expected POST.' });
    }

    try {
        const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = req.body;

        // Strict validation: Amount must exist and be at least 100 paise (1 INR)
        if (!amount || isNaN(amount) || amount < 100) {
            return res.status(400).json({ error: 'Invalid amount. Minimum transaction amount must be 100 paise.' });
        }

        // Failsafe: Ensure environment variables are loaded securely
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("[Parbet API] Fatal Error: Razorpay credentials missing from server environment.");
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // Initialize Razorpay SDK
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Construct standard order payload
        const options = {
            amount: Math.round(amount), // Ensure integer value in paise
            currency: currency,
            receipt: receipt,
        };

        // Await order creation from Razorpay network
        const order = await razorpay.orders.create(options);

        if (!order || !order.id) {
            throw new Error("Razorpay API failed to generate a secure order ID.");
        }

        // Return the secure order payload back to the client
        return res.status(200).json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error) {
        console.error("[Parbet API] Order Creation Error:", error);
        return res.status(500).json({ 
            error: 'Internal Server Error. Failed to establish secure payment order.', 
            details: error.message 
        });
    }
}