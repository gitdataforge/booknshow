import crypto from 'crypto';

export default async function handler(req, res) {
  // Only allow POST requests for payment verification
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed. Please use POST.' 
    });
  }

  try {
    // Extract the payment details sent by the Razorpay checkout script on the frontend
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Validate that all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required payment parameters. Cannot verify signature.' 
      });
    }

    // Ensure the Razorpay secret is configured in the environment
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      console.error('Server configuration error: RAZORPAY_KEY_SECRET is missing.');
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server configuration error.' 
      });
    }

    // Step 1: Create the expected signature payload
    // Razorpay dictates that the payload must be the order_id and payment_id separated by a pipe character
    const generated_signature_payload = razorpay_order_id + '|' + razorpay_payment_id;

    // Step 2: Generate the HMAC-SHA256 hash using the Razorpay Key Secret
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(generated_signature_payload.toString())
      .digest('hex');

    // Step 3: Compare the generated signature with the signature provided by the frontend
    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // The payment is verified and authentic.
      // Insert database logic here to update the user's order status to "PAID" or "COMPLETED".
      // Example: await database.orders.updateStatus(razorpay_order_id, 'PAID');
      
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id
        }
      });
    } else {
      // The signature did not match, meaning the request might be tampered with.
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature. Verification failed.' 
      });
    }
  } catch (error) {
    console.error('Payment verification process encountered an error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error during payment verification.' 
    });
  }
}