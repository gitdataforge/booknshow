const APP_ID = import.meta.env.VITE_BANDSINTOWN_APP_ID || 'parbet_2026_app';

/**
 * Fetches local underground music, gigs, and club events based strictly on the user's city.
 * @param {string} city - The manually locked city from the global store.
 */
export const fetchBandsintownEvents = async (city) => {
    if (!APP_ID || !city) return [];
    
    try {
        // Query Bandsintown events strictly restricted by location parameter
        const url = `https://rest.bandsintown.com/v4/events?app_id=${APP_ID}&location=${encodeURIComponent(city)}&date=upcoming`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Bandsintown API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Bandsintown returns an array directly on success, or an error object
        const events = Array.isArray(data) ? data : [];
        
        // Map payload strictly to Parbet's normalized event object
        return events.map(event => {
            const date = new Date(event.datetime);
            
            return {
                id: `bit_${event.id}`,
                t1: event.artist?.name || event.title || 'Live Music Gig',
                t2: null,
                league: 'Local Concerts',
                commence_time: date.toISOString(),
                dow: date.toLocaleDateString('en-US', { weekday: 'short' }),
                day: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                loc: `${event.venue?.name || 'TBA'}, ${event.venue?.city || city}`,
                country: event.venue?.country || 'IN',
                source: 'Bandsintown'
            };
        });
    } catch (err) {
        console.warn('Bandsintown Fetch Dropped:', err.message);
        return [];
    }
};