/**
 * FEATURE 1: Dynamic SDK Injection (Prevents heavy script loading on global app initialization)
 * FEATURE 2: Promise-Based Resolution (Allows the Checkout component to await SDK readiness)
 * FEATURE 3: Global Namespace Detection (Prevents duplicate script injections on re-renders)
 * FEATURE 4: Strict Error Interception (Returns false if network blocks the external script)
 */

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // FEATURE 3: Prevent duplicate script injection if already loaded in the window object
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
            resolve(true);
        };

        script.onerror = () => {
            console.error('[Parbet Gateway] Failed to load Razorpay SDK. Check network or ad-blockers.');
            resolve(false);
        };

        document.body.appendChild(script);
    });
};