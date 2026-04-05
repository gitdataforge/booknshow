const API_KEY = import.meta.env.VITE_THESPORTSDB_API_KEY || '3';

/**
 * Fetches domestic Indian leagues (ISL & IPL) and strictly filters them by the user's city.
 * @param {string} city - The manually locked city from the global store.
 */
export const fetchTheSportsDbEvents = async (city) => {
    if (!API_KEY || !city) return [];
    
    // Target Leagues: 4422 = Indian Super League (Football), 4356 = Indian Premier League (Cricket)
    const indianLeagues = [4422, 4356];
    
    try {
        // Fetch upcoming schedules concurrently for all targeted domestic leagues
        const promises = indianLeagues.map(id => 
            fetch(`https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${id}`)
                .then(res => res.ok ? res.json() : { events: [] })
                .catch(() => ({ events: [] })) // Isolate network failures per league
        );

        const results = await Promise.all(promises);
        const allLeagueEvents = results.flatMap(data => data.events || []);

        // STRICT MANUAL LOCATION FILTER:
        // TheSportsDB does not support ?city= in the query, so we must filter the raw payload in JS.
        // If the stadium/venue name does not include the user's exact city, the event is deleted.
        const targetCityLower = city.toLowerCase();
        const locallyFilteredEvents = allLeagueEvents.filter(event => {
            const venue = (event.strVenue || '').toLowerCase();
            return venue.includes(targetCityLower);
        });

        // Map the filtered payload strictly to Parbet's normalized event object
        return locallyFilteredEvents.map(event => {
            // Reconstruct proper ISO time from split date/time fields
            const dateStr = event.strTimestamp || `${event.dateEvent}T${event.strTime || '00:00:00'}`;
            const date = new Date(dateStr);
            
            return {
                id: `tsdb_${event.idEvent}`,
                t1: event.strHomeTeam,
                t2: event.strAwayTeam,
                league: event.strLeague,
                commence_time: date.toISOString(),
                dow: date.toLocaleDateString('en-US', { weekday: 'short' }),
                day: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                loc: event.strVenue || city,
                country: event.strCountry || 'IN',
                source: 'TheSportsDB'
            };
        });
    } catch (err) {
        console.warn('TheSportsDB Fetch Dropped:', err.message);
        return [];
    }
};