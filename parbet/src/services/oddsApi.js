const API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export const fetchRealUpcomingMatches = async () => {
    if (!API_KEY) {
        throw new Error("Missing API Key. Please add VITE_ODDS_API_KEY to your .env file.");
    }

    try {
        // Fetching real upcoming sports (soccer, cricket, basketball) with real bookmaker odds
        const response = await fetch(`${BASE_URL}/upcoming/odds/?regions=eu,uk&markets=h2h&apiKey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform the complex API data into our clean Viagogo UI format
        const formattedMatches = data.map((match, index) => {
            const date = new Date(match.commence_time);
            const monthObj = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
            const day = date.getDate();
            const dow = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
            const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            // Extract the first available bookmaker's home team odds, or fallback to 'N/A'
            let homeOdds = 'N/A';
            if (match.bookmakers && match.bookmakers.length > 0) {
                const h2hMarket = match.bookmakers[0].markets.find(m => m.key === 'h2h');
                if (h2hMarket && h2hMarket.outcomes) {
                    const homeOutcome = h2hMarket.outcomes.find(o => o.name === match.home_team);
                    if (homeOutcome) homeOdds = homeOutcome.price.toFixed(2);
                }
            }

            return {
                id: match.id,
                month: monthObj,
                day: day.toString(),
                dow: dow,
                league: match.sport_title,
                t1: match.home_team,
                t2: match.away_team,
                time: time,
                loc: "Global • Verified Venue",
                odds: homeOdds,
                tag: index === 0 ? "Hottest event on our site" : (index < 3 ? "Selling Fast" : null),
                tagColor: index === 0 ? "text-brand-accent bg-brand-primaryLight" : "text-brand-red bg-red-50"
            };
        });

        // Return top 15 results to prevent UI overload
        return formattedMatches.slice(0, 15);

    } catch (error) {
        console.error("Failed to fetch real matches:", error);
        throw error;
    }
};