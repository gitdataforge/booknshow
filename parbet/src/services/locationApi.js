export const fetchUserCity = async () => {
    try {
        // Free, legal, zero-auth IP geolocation endpoint used to replicate Viagogo's zero-click localization
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
            throw new Error("Location fetch failed due to network or rate limit.");
        }
        
        const data = await response.json();
        
        // Return the exact city name dynamically, or fallback if the API payload is malformed
        return data.city || "Mumbai"; 
    } catch (error) {
        console.error("Location API Error:", error);
        // Graceful fallback ensures the UI doesn't crash if the user's browser blocks the IP request
        return "All Cities"; 
    }
};