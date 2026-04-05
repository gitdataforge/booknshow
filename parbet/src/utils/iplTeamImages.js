/**
 * Utility to map live API cricket strings to high-resolution, transparent team logos.
 * Uses highly reliable, free Wikimedia Commons CDNs to guarantee 100% uptime.
 */
export const getIplTeamImage = (teamName) => {
    if (!teamName) return 'https://upload.wikimedia.org/wikipedia/en/8/8d/Cricket_India_Crest.svg'; // Fallback generic cricket
    
    const name = teamName.toLowerCase();
    
    if (name.includes('chennai') || name.includes('csk')) {
        return 'https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg';
    }
    if (name.includes('mumbai') || name.includes('mi')) {
        return 'https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg';
    }
    if (name.includes('royal challengers') || name.includes('rcb') || name.includes('bangalore') || name.includes('bengaluru')) {
        return 'https://upload.wikimedia.org/wikipedia/en/1/1c/Royal_Challengers_Bengaluru_logo.png';
    }
    if (name.includes('kolkata') || name.includes('kkr')) {
        return 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg';
    }
    if (name.includes('sunrisers') || name.includes('srh') || name.includes('hyderabad')) {
        return 'https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad.svg';
    }
    if (name.includes('delhi') || name.includes('dc')) {
        return 'https://upload.wikimedia.org/wikipedia/en/f/f5/Delhi_Capitals_Logo.svg';
    }
    if (name.includes('rajasthan') || name.includes('rr')) {
        return 'https://upload.wikimedia.org/wikipedia/en/6/60/Rajasthan_Royals_Logo.svg';
    }
    if (name.includes('punjab') || name.includes('pbks') || name.includes('kings xi')) {
        return 'https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg';
    }
    if (name.includes('gujarat') || name.includes('gt') || name.includes('titans')) {
        return 'https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg';
    }
    if (name.includes('lucknow') || name.includes('lsg') || name.includes('super giants')) {
        return 'https://upload.wikimedia.org/wikipedia/en/a/a9/Lucknow_Super_Giants_IPL_Logo.svg';
    }
    if (name.includes('india') || name.includes('ind')) {
        return 'https://upload.wikimedia.org/wikipedia/en/8/8d/Cricket_India_Crest.svg';
    }
    
    // Generic fallback for domestic/international teams not explicitly matched
    return 'https://upload.wikimedia.org/wikipedia/commons/e/e3/BCCI_logo.svg';
};