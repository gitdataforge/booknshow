/**
 * src/services/eventAggregator.js
 * * Master Controller for Parbet 2026 Multi-API Orchestration.
 * Aggregates data from The Odds API, CricAPI, SeatGeek, Ticketmaster, Bandsintown, and TheSportsDB.
 * Strictly handles deduplication, normalization, temporal filtering, cascading geo-fencing, and CONTENT SANITIZATION.
 */

import { fetchTicketmasterEvents } from './ticketmasterApi';
import { fetchBandsintownEvents } from './bandsintownApi';
import { fetchTheSportsDbEvents } from './theSportsDbApi';

// Strict Sanitization: If the .env file contains dummy strings, explicitly convert them to empty strings
const rawOdds = import.meta.env.VITE_ODDS_API_KEY || '';
const ODDS_API_KEY = rawOdds.includes('your_') ? '' : rawOdds;

const rawCric = import.meta.env.VITE_CRIC_API_KEY || '';
const CRIC_API_KEY = (rawCric.includes('your_') || rawCric === '641ae896-419d-444a-a2fd-f0ecc4a2aeba') ? '' : rawCric;

const rawSeatGeek = import.meta.env.VITE_SEATGEEK_CLIENT_ID || '';
const SEATGEEK_CLIENT_ID = rawSeatGeek.includes('your_') ? '' : rawSeatGeek;

/**
 * Enhanced fetch with exponential backoff and strict early-exit auth/network checks.
 */
async function fetchWithRetry(url, options = {}, retries = 5, backoff = 1000) {
    let response;
    
    try {
        response = await fetch(url, options);
    } catch (networkError) {
        // Strict early-exit: Instantly abort on hard network drops to prevent console spam
        const errMsg = networkError.message || '';
        if (errMsg.includes('Failed to fetch') || errMsg.includes('NetworkError') || errMsg.includes('ERR_CONNECTION_RESET')) {
            throw networkError;
        }

        // Handle pure network failures (e.g., temporary DNS drops)
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw networkError;
    }

    // Strict suppression: If the API explicitly rejects our authentication (401),
    // return an empty array immediately to prevent breaking the aggregator loop or logging errors.
    if (!response.ok) {
        if (response.status === 401) {
            return []; 
        }

        if (response.status === 403) {
            throw new Error(`Critical Auth Error (${response.status}): Aborting retry loop for ${url}`);
        }
        
        // For other HTTP errors (like 429 Too Many Requests or 500 Server Error), continue retrying
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}

/**
 * Normalizes Odds API data structure
 */
function transformOddsEvent(match) {
    const date = new Date(match.commence_time);
    return {
        id: match.id,
        t1: match.home_team,
        t2: match.away_team,
        league: match.sport_title,
        commence_time: match.commence_time,
        dow: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        loc: "Verified Venue", 
        country: 'GLOBAL', 
        source: 'OddsAPI'
    };
}

/**
 * Normalizes CricAPI (CricketData.org) structure for IPL 2026 and International Cricket
 */
function transformCricEvent(match) {
    const date = new Date(match.dateTimeGMT);
    // FIXED: Existence check using optional chaining and fallback empty string to prevent split error
    const matchName = match?.name || '';
    const teams = matchName.split(' vs ');
    
    return {
        id: match.id,
        t1: teams[0] || 'Team A',
        t2: teams[1] || 'Team B',
        league: match.series_id || 'Cricket',
        commence_time: match.dateTimeGMT,
        dow: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        loc: match.venue || 'Cricket Stadium',
        country: 'IN',
        source: 'CricAPI'
    };
}

/**
 * Normalizes SeatGeek data structure for Concerts, Theatre, and Global Events
 */
function transformSeatGeekEvent(event) {
    const date = new Date(event.datetime_utc);
    return {
        id: `sg_${event.id}`,
        t1: event.performers[0]?.name || event.title,
        t2: event.performers.length > 1 ? event.performers[1].name : null,
        league: event.type.charAt(0).toUpperCase() + event.type.slice(1),
        commence_time: event.datetime_utc,
        dow: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        loc: `${event.venue.city}, ${event.venue.name}`,
        country: event.venue.country || 'US',
        source: 'SeatGeek'
    };
}

/**
 * Main Aggregator logic
 * @param {Object} location - { city, state, countryCode }
 */
export async function aggregateAllEvents(location = { city: 'Mumbai', state: 'Maharashtra', countryCode: 'IN' }) {
    const promises = [];

    // 1. Fetch from Odds API (Soccer, NBA, etc)
    if (ODDS_API_KEY) {
        const oddsUrl = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?regions=us,uk,eu,au&markets=h2h&apiKey=${ODDS_API_KEY}`;
        promises.push(
            fetchWithRetry(oddsUrl)
                .then(data => Array.isArray(data) ? data.map(transformOddsEvent) : [])
                .catch((err) => {
                    console.warn("OddsAPI Data Dropped:", err.message);
                    return [];
                })
        );
    }

    // 2. Fetch from CricAPI (IPL 2026 Focus) - STRICT PROXY UPDATE
    if (CRIC_API_KEY) {
        const cricUrl = `/api/cricapi/v1/cricScore?apikey=${CRIC_API_KEY}`;
        promises.push(
            fetchWithRetry(cricUrl)
                .then(data => (data.data || []).map(transformCricEvent))
                .catch((err) => {
                    console.warn("CricAPI Data Dropped:", err.message);
                    return [];
                })
        );
    }

    // 3. Fetch from SeatGeek (Concerts & Theatre based on user location) - STRICT PROXY UPDATE
    if (SEATGEEK_CLIENT_ID) {
        const sgUrl = `/api/seatgeek/2/events?venue.city=${encodeURIComponent(location.city)}&client_id=${SEATGEEK_CLIENT_ID}&per_page=50`;
        promises.push(
            fetchWithRetry(sgUrl)
                .then(data => (data.events || []).map(transformSeatGeekEvent))
                .catch((err) => {
                    console.warn("SeatGeek Data Dropped:", err.message);
                    return [];
                })
        );
    }

    // 4. Fetch from Ticketmaster (Indian Concerts & Global Matches)
    promises.push(
        fetchTicketmasterEvents(location.city)
            .catch(err => {
                console.warn("Ticketmaster Data Dropped:", err.message);
                return [];
            })
    );

    // 5. Fetch from Bandsintown (Local Underground Music & Gigs)
    promises.push(
        fetchBandsintownEvents(location.city)
            .catch(err => {
                console.warn("Bandsintown Data Dropped:", err.message);
                return [];
            })
    );

    // 6. Fetch from TheSportsDB (Indian Super League & Domestic Cricket)
    promises.push(
        fetchTheSportsDbEvents(location.city)
            .catch(err => {
                console.warn("TheSportsDB Data Dropped:", err.message);
                return [];
            })
    );

    try {
        const allFetchedGroups = await Promise.all(promises);
        const flattened = allFetchedGroups.flat();

        const seen = new Set();
        const unified = flattened.filter(event => {
            // STRICT CRICKET & KABADDI SANITIZATION LAYER
            if (event.source !== 'CricAPI') {
                const searchString = `${event.t1} ${event.t2 || ''} ${event.league || ''}`.toLowerCase();
                const isApprovedContent = 
                    searchString.includes('cricket') || 
                    searchString.includes('ipl') || 
                    searchString.includes('t20') || 
                    searchString.includes('icc') || 
                    searchString.includes('test') || 
                    searchString.includes('odi') || 
                    searchString.includes('kabaddi') || 
                    searchString.includes('pkl');
                
                if (!isApprovedContent) return false;
            }

            const startTime = new Date(event.commence_time).getTime();
            if (startTime < Date.now()) return false;

            const slug = `${event.t1}-${event.t2}-${event.day}-${event.month}`.toLowerCase();
            if (seen.has(slug)) return false;
            seen.add(slug);

            event.proximityScore = 1; 

            if (location && location.city && location.city !== 'All Cities' && location.city !== 'Global') {
                const targetCity = location.city.toLowerCase();
                const targetState = (location.state || 'maharashtra').toLowerCase();
                const targetCountry = (location.countryCode || 'in').toLowerCase();

                const eventLoc = (event.loc || '').toLowerCase();
                const eventCity = (event.city || '').toLowerCase();
                const eventCountry = (event.country || '').toLowerCase();
                
                if (eventCountry === 'global') {
                    event.proximityScore = 1;
                    event.isGlobal = true;
                } else {
                    if (eventLoc.includes(targetCity) || eventCity.includes(targetCity)) {
                        event.proximityScore = 3;
                        event.isLocal = true;
                    } 
                    else if (eventLoc.includes(targetState) || eventCity.includes(targetState)) {
                        event.proximityScore = 2;
                        event.isStateLevel = true;
                    } 
                    else if (eventCountry === targetCountry || eventCountry === 'in' || eventCountry === 'india' || eventLoc.includes('india')) {
                        event.proximityScore = 1;
                        event.isNational = true;
                    } 
                    else {
                        return false; 
                    }
                }
            }
            return true;
        });

        return unified.sort((a, b) => {
            if (b.proximityScore !== a.proximityScore) {
                return b.proximityScore - a.proximityScore;
            }
            return new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime();
        });

    } catch (error) {
        console.error("Aggregation Critical Failure:", error);
        return [];
    }
}

export function filterEventsByPerformer(events, performerName, filters = {}) {
    return events.filter(e => {
        const isParticipant = e.t1.toLowerCase().includes(performerName.toLowerCase()) || 
                             (e.t2 && e.t2.toLowerCase().includes(performerName.toLowerCase()));
        
        if (!isParticipant) return false;

        if (filters.homeOnly && !e.t1.toLowerCase().includes(performerName.toLowerCase())) return false;
        if (filters.awayOnly && e.t1.toLowerCase().includes(performerName.toLowerCase())) return false;
        if (filters.opponent && !e.t1.toLowerCase().includes(filters.opponent.toLowerCase()) && 
            !e.t2?.toLowerCase().includes(filters.opponent.toLowerCase())) return false;

        return true;
    });
}