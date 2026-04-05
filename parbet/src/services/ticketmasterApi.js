const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY || '';

/**
 * Fetches real-world concerts, comedy, and theater events based strictly on the user's city.
 * @param {string} city - The manually locked city from the global store.
 */
export const fetchTicketmasterEvents = async (city) => {
    if (!API_KEY || !city) return [];
    
    try {
        // Query Ticketmaster Discovery API with strict city matching and chronological sorting
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${encodeURIComponent(city)}&sort=date,asc&size=40`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Ticketmaster API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        const events = data._embedded?.events || [];
        
        // Map complex Ticketmaster payload strictly to Parbet's normalized event object
        return events.map(event => {
            const date = new Date(event.dates?.start?.dateTime || event.dates?.start?.localDate || Date.now());
            const venue = event._embedded?.venues?.[0] || {};
            
            return {
                id: `tm_${event.id}`,
                t1: event.name,
                t2: null, // Ticketmaster rarely uses T2 format for concerts
                league: event.classifications?.[0]?.segment?.name || 'Live Event',
                commence_time: date.toISOString(),
                dow: date.toLocaleDateString('en-US', { weekday: 'short' }),
                day: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                loc: `${venue.name || 'TBA Venue'}, ${venue.city?.name || city}`,
                country: venue.country?.countryCode || 'IN',
                source: 'Ticketmaster'
            };
        });
    } catch (err) {
        console.warn('Ticketmaster Fetch Dropped:', err.message);
        return [];
    }
};