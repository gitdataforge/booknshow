import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// FEATURE 1: Secure Environment Variable Binding
const appId = typeof __app_id !== 'undefined' ? __app_id : 'parbet-44902';

// FEATURE 2: High-Fidelity 2026 IPL Match Matrix
// Strictly mapped to Bengaluru, Hyderabad, Chennai, and Mumbai with real upcoming May 2026 dates
const IPL_2026_SCHEDULE = [
    { t1: 'Royal Challengers Bengaluru', t2: 'Chennai Super Kings', loc: 'M. Chinnaswamy Stadium', city: 'Bengaluru', date: '2026-05-02T19:30:00+05:30', basePrice: 45000, section: 'P Corporate Box', row: 'A', qty: 2 },
    { t1: 'Mumbai Indians', t2: 'Sunrisers Hyderabad', loc: 'Wankhede Stadium', city: 'Mumbai', date: '2026-05-04T19:30:00+05:30', basePrice: 12500, section: 'Sachin Tendulkar Stand', row: 'L', qty: 4 },
    { t1: 'Chennai Super Kings', t2: 'Kolkata Knight Riders', loc: 'M. A. Chidambaram Stadium', city: 'Chennai', date: '2026-05-06T15:30:00+05:30', basePrice: 8500, section: 'C Lower', row: 'G', qty: 3 },
    { t1: 'Sunrisers Hyderabad', t2: 'Delhi Capitals', loc: 'Rajiv Gandhi International Stadium', city: 'Hyderabad', date: '2026-05-08T19:30:00+05:30', basePrice: 4500, section: 'South Pavilion', row: 'C', qty: 6 },
    { t1: 'Royal Challengers Bengaluru', t2: 'Mumbai Indians', loc: 'M. Chinnaswamy Stadium', city: 'Bengaluru', date: '2026-05-10T19:30:00+05:30', basePrice: 38000, section: 'Qatar Airways Stand VVIP', row: 'B', qty: 2 },
    { t1: 'Mumbai Indians', t2: 'Chennai Super Kings', loc: 'Wankhede Stadium', city: 'Mumbai', date: '2026-05-12T19:30:00+05:30', basePrice: 42000, section: 'MCA Pavilion VVIP', row: 'A', qty: 2 },
    { t1: 'Chennai Super Kings', t2: 'Rajasthan Royals', loc: 'M. A. Chidambaram Stadium', city: 'Chennai', date: '2026-05-14T19:30:00+05:30', basePrice: 6500, section: 'Anna Pavilion', row: 'K', qty: 5 },
    { t1: 'Sunrisers Hyderabad', t2: 'Royal Challengers Bengaluru', loc: 'Rajiv Gandhi International Stadium', city: 'Hyderabad', date: '2026-05-15T19:30:00+05:30', basePrice: 18000, section: 'North Stand First Floor', row: 'E', qty: 4 },
    { t1: 'Royal Challengers Bengaluru', t2: 'Kolkata Knight Riders', loc: 'M. Chinnaswamy Stadium', city: 'Bengaluru', date: '2026-05-17T15:30:00+05:30', basePrice: 9500, section: 'M Stand', row: 'H', qty: 3 },
    { t1: 'Mumbai Indians', t2: 'Delhi Capitals', loc: 'Wankhede Stadium', city: 'Mumbai', date: '2026-05-18T19:30:00+05:30', basePrice: 15500, section: 'Garware Pavilion', row: 'D', qty: 4 },
    { t1: 'Chennai Super Kings', t2: 'Sunrisers Hyderabad', loc: 'M. A. Chidambaram Stadium', city: 'Chennai', date: '2026-05-20T19:30:00+05:30', basePrice: 11000, section: 'I Lower', row: 'F', qty: 2 },
    { t1: 'Sunrisers Hyderabad', t2: 'Mumbai Indians', loc: 'Rajiv Gandhi International Stadium', city: 'Hyderabad', date: '2026-05-21T19:30:00+05:30', basePrice: 5500, section: 'West Stand Ground', row: 'M', qty: 8 },
    { t1: 'Royal Challengers Bengaluru', t2: 'Rajasthan Royals', loc: 'M. Chinnaswamy Stadium', city: 'Bengaluru', date: '2026-05-22T19:30:00+05:30', basePrice: 14000, section: 'A Stand', row: 'C', qty: 2 },
    { t1: 'Mumbai Indians', t2: 'Punjab Kings', loc: 'Wankhede Stadium', city: 'Mumbai', date: '2026-05-24T15:30:00+05:30', basePrice: 7500, section: 'Sunil Gavaskar Stand', row: 'J', qty: 5 },
    { t1: 'Chennai Super Kings', t2: 'Lucknow Super Giants', loc: 'M. A. Chidambaram Stadium', city: 'Chennai', date: '2026-05-25T19:30:00+05:30', basePrice: 9000, section: 'H Upper', row: 'B', qty: 4 },
    { t1: 'Sunrisers Hyderabad', t2: 'Gujarat Titans', loc: 'Rajiv Gandhi International Stadium', city: 'Hyderabad', date: '2026-05-26T19:30:00+05:30', basePrice: 3500, section: 'East Stand', row: 'R', qty: 10 },
    { t1: 'Royal Challengers Bengaluru', t2: 'Lucknow Super Giants', loc: 'M. Chinnaswamy Stadium', city: 'Bengaluru', date: '2026-05-27T19:30:00+05:30', basePrice: 22000, section: 'Terrace Level VVIP', row: 'AA', qty: 2 },
    { t1: 'Mumbai Indians', t2: 'Kolkata Knight Riders', loc: 'Wankhede Stadium', city: 'Mumbai', date: '2026-05-28T19:30:00+05:30', basePrice: 28000, section: 'Vijay Merchant Pavilion', row: 'B', qty: 3 },
    { t1: 'Chennai Super Kings', t2: 'Punjab Kings', loc: 'M. A. Chidambaram Stadium', city: 'Chennai', date: '2026-05-29T19:30:00+05:30', basePrice: 48000, section: 'Madras Cricket Club Hospitality', row: 'A', qty: 2 },
    { t1: 'Sunrisers Hyderabad', t2: 'Rajasthan Royals', loc: 'Rajiv Gandhi International Stadium', city: 'Hyderabad', date: '2026-05-30T19:30:00+05:30', basePrice: 3200, section: 'General Admission', row: 'Z', qty: 8 }
];

// FEATURE 3: Atomic Firebase Batch Executor
export const executeIPLSeed = async () => {
    try {
        const currentUser = auth.currentUser;
        
        // FEATURE 4: Strict Admin Auth Guard (Prevents rogue seller executions)
        if (!currentUser) {
            throw new Error("Authentication failed. No active session detected.");
        }
        
        const validAdmins = ['testcodecfg@gmail.com', 'krishnamehta.gm@gmail.com', 'jatinseth.op@gmail.com'];
        if (!validAdmins.includes(currentUser.email)) {
            throw new Error("Permission Denied: Only authorized administrators can trigger batch injections.");
        }

        const batch = writeBatch(db);
        const eventsCollectionRef = collection(db, 'events');
        let processedCount = 0;

        IPL_2026_SCHEDULE.forEach((match) => {
            // FEATURE 5: Dynamic Price Randomization Guard (Strict 3k-50k Variance)
            // Adds slight authentic variance to the base price to mimic organic seller pricing
            let finalPrice = match.basePrice + Math.floor(Math.random() * 500) - 250;
            if (finalPrice < 3000) finalPrice = 3000;
            if (finalPrice > 50000) finalPrice = 50000;

            // FEATURE 6: Deterministic Cross-Platform Slug Generation
            const dateStr = match.date.split('T')[0];
            const rawSlug = `${match.t1}-${match.t2}-${dateStr}`;
            const eventId = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const newDocRef = doc(eventsCollectionRef);

            // FEATURE 7: Production Schema Data Construction
            batch.set(newDocRef, {
                eventId: eventId,
                sellerId: currentUser.uid,
                t1: match.t1,
                t2: match.t2,
                league: 'Indian Premier League',
                eventName: `${match.t1} vs ${match.t2}`,
                commence_time: new Date(match.date).toISOString(), // FEATURE 8: ISO Timezone Normalization
                loc: match.loc,
                city: match.city,
                country: 'IN',
                price: finalPrice,
                quantity: match.qty,
                section: match.section,
                row: match.row,
                status: 'active',
                createdAt: serverTimestamp(), // FEATURE 9: Firebase Server Timestamp Sync
                isSeeded: true // Metatag for database maintenance
            });
            processedCount++;
        });

        // FEATURE 10: Atomic Commit Execution
        // All 20 matches write simultaneously, preventing partial database corruption if network fails
        await batch.commit();
        return { success: true, message: `Successfully injected ${processedCount} IPL 2026 matches into the live marketplace.` };

    } catch (error) {
        console.error("IPL Seed Injection Failed:", error);
        throw error;
    }
};