export const fetchUserCity = async () => {
    try {
        // Free, highly resilient IP geolocation endpoint that natively permits cloud IDEs/Codespaces
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        
        if (!response.ok) {
            throw new Error("Location fetch failed due to network or rate limit.");
        }
        
        const data = await response.json();
        
        // Return the strictly normalized object containing city, country code, and coordinates for the aggregator
        return {
            city: data.city || "Mumbai",
            state: data.region || "Maharashtra",
            countryCode: data.country_code || "IN",
            lat: parseFloat(data.latitude) || 19.0760,
            lon: parseFloat(data.longitude) || 72.8777
        };
    } catch (error) {
        console.error("Location API Error:", error);
        // Graceful fallback object ensures the Store and Aggregator don't crash on network failure
        return {
            city: "All Cities",
            state: "",
            countryCode: "IN", // Default to India for fallback feed
            lat: null,
            lon: null
        };
    }
};