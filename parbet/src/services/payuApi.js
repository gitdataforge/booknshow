/**
 * PayU India Production/Sandbox Integration Service
 * Strictly follows PayU's Web Checkout (Non-Seamless) logic.
 */

const PAYU_KEY = import.meta.env.VITE_PAYU_MERCHANT_KEY || '';
const PAYU_SALT = import.meta.env.VITE_PAYU_SALT || ''; // Note: In high-security production, this hash should be generated on your Node/Firebase backend.
const PAYU_ENV = import.meta.env.VITE_PAYU_ENV || 'test'; // 'test' or 'prod'

const PAYU_URLS = {
    test: 'https://test.payu.in/_payment',
    prod: 'https://secure.payu.in/_payment'
};

/**
 * Generates a SHA-512 hash for PayU transaction security.
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
async function generatePayUHash(params) {
    const { txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '' } = params;
    
    // Construct the pipe-separated string exactly as PayU requires
    const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PAYU_SALT}`;
    
    // Use browser native SubtleCrypto for SHA-512
    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

/**
 * Initiates the PayU payment by creating a hidden form and submitting it.
 * This function is called at the final "Buy Now" step of the checkout wizard.
 */
export const initiatePayUPayment = async (orderData) => {
    try {
        if (!PAYU_KEY || !PAYU_SALT) {
            throw new Error("PayU configuration missing. Please check VITE_PAYU_MERCHANT_KEY and VITE_PAYU_SALT in .env");
        }

        const txnid = `PB_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const amount = parseFloat(orderData.totalAmount).toFixed(2);
        
        // Prepare parameters for hash generation
        const hashParams = {
            txnid,
            amount,
            productinfo: orderData.eventName,
            firstname: orderData.firstName,
            email: orderData.email,
        };

        const hash = await generatePayUHash(hashParams);

        // Define the production form data
        const payuData = {
            key: PAYU_KEY,
            txnid: txnid,
            amount: amount,
            productinfo: orderData.eventName,
            firstname: orderData.firstName,
            lastname: orderData.lastName || '',
            email: orderData.email,
            phone: orderData.phone,
            surl: `${window.location.origin}/dashboard?status=payment_success&txnid=${txnid}`,
            furl: `${window.location.origin}/checkout?status=payment_failed&txnid=${txnid}`,
            hash: hash,
            service_provider: 'payu_paisa'
        };

        // Create a hidden form and submit it programmatically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = PAYU_URLS[PAYU_ENV];

        Object.keys(payuData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = payuData[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        
        // Trigger high-fidelity redirection animation/feedback before submit
        console.log(`[PayU] Redirecting to ${PAYU_ENV} gateway...`, txnid);
        form.submit();

        return { success: true, txnid };
    } catch (error) {
        console.error("PayU Integration Error:", error);
        throw error;
    }
};

/**
 * Utility to verify a response hash from PayU callback (optional security check)
 */
export const verifyPayUResponse = async (response) => {
    // Formula for return: sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    const { status, udf1, udf2, udf3, udf4, udf5, email, firstname, productinfo, amount, txnid, hash: receivedHash } = response;
    
    const reverseHashString = `${PAYU_SALT}|${status}||||||${udf5 || ''}|${udf4 || ''}|${udf3 || ''}|${udf2 || ''}|${udf1 || ''}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(reverseHashString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return calculatedHash === receivedHash;
};