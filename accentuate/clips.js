// Accentuate clip pool. start/end are seconds into the YouTube video.
// Edit timings with /accentuate/?curate, then paste the exported JSON back here.
// tier: 1 = easy (giveaway word), 2 = medium (strong sound tell), 3 = hard (subtle sounds). Rounds go 1,1,2,3,3.
// "verified": false = hometown taken from the office they hold, not yet checked against a bio.
window.CLIPS = [
  { id: "MudZKgvnP30", region: "boston", tier: 3, start: 517, end: 537, name: "Ed Flynn", role: "Boston City Councilor, District 2", place: "South Boston, Massachusetts", lat: 42.3381, lng: -71.0476, verified: true,
    words: [["year", 2.2], ["area", 4.5]],
    note: "Eastern New England English. Listen for the r that drops after vowels (\"cah,\" \"hahbuh\") and the broad a in words like \"aunt\" and \"half.\"" },
  { id: "PYpcgR19WyA", region: "philly", tier: 3, start: 158, end: 178, name: "Mark Squilla", role: "Philadelphia City Councilmember, 1st District", place: "South Philadelphia, Pennsylvania", lat: 39.9246, lng: -75.1695, verified: true,
    words: [["around", 2.7], ["open", 4.0], ["about", 8.5], ["know", 9.6], ["so", 12.2], ["go", 17.0]],
    note: "Philadelphia English is its own system. \"Water\" leans toward \"wooder,\" and the vowel in \"go\" and \"home\" starts further forward in the mouth." },
  { id: "Nb7h08qb4II", region: "nyc", tier: 3, start: 110, end: 130, name: "Vito Fossella", role: "Staten Island Borough President", place: "Staten Island, New York", lat: 40.5795, lng: -74.1502, verified: true,
    words: [["plan", 4.1], ["better", 8.9]],
    note: "New York City English. The vowel in \"talk\" and \"coffee\" rises and glides (\"cawfee\"), and r after vowels often softens or disappears." },
  { id: "oHyN77BUESA", region: "baltimore", tier: 2, start: 183, end: 213, name: "Isaac Schleifer", role: "Baltimore City Council Member, 5th District", place: "Baltimore, Maryland", lat: 39.3563, lng: -76.6917, verified: false,
    words: [["so", 6.2], ["going", 7.6], ["out", 8.2], ["know", 12.7]],
    note: "Baltimore sits where Northern and Southern American English meet. The famous \"Bawlmer\" o, in \"home\" and \"go,\" starts low and open." },
  { id: "OMn_mq4hia4", region: "upper_midwest", tier: 3, start: 79, end: 99, name: "Kevin Anderson", role: "Hennepin County Commissioner", place: "Hennepin County, Minnesota", lat: 45.0725, lng: -93.4558, verified: false,
    words: [["so", 0.4], ["out", 13.9], ["make", 18.9], ["sure", 19.0]],
    note: "Upper Midwest English. Vowels in \"go\" and \"day\" hold steady instead of gliding, and \"bag\" can sound close to \"bayg.\"" },
  { id: "v_-IbLHJRu0", region: "cajun", tier: 2, start: 43, end: 73, name: "Archie Chaisson", role: "Lafourche Parish President", place: "Lafourche Parish, Louisiana", lat: 29.7958, lng: -90.8229, verified: false,
    words: [["the", 3.6], ["with", 7.1], ["through", 8.8], ["them", 9.4], ["that", 12.2], ["have", 18.4]],
    note: "Cajun English, shaped by Louisiana French. Stress lands late in phrases, and \"th\" often comes out closer to \"d\" or \"t.\"" },
  { id: "Q0UOjfCJhvo", region: "deep_south", tier: 3, start: 495, end: 515, name: "Toby Barker", role: "Mayor of Hattiesburg", place: "Hattiesburg, Mississippi", lat: 31.3271, lng: -89.2903, verified: true,
    words: [["i", 0.7], ["five", 13.9], ["ten", 14.3], ["well", 16.2], ["when", 19.7]],
    note: "Deep South English. Listen for \"I\" flattening to \"ah\" (\"rahd\" for ride) and short vowels that stretch into two parts." },
  { id: "CurdFR-WRLA", region: "deep_south", tier: 3, start: 98, end: 118, name: "Walt Maddox", role: "Mayor of Tuscaloosa", place: "Tuscaloosa, Alabama", lat: 33.2098, lng: -87.5692, verified: true,
    words: [["well", 0.6], ["men", 1.4], ["fire", 13.3]],
    note: "Alabama English. A Southern vowel system with a measured, unhurried delivery. This clip comes from the days after the April 2011 tornado." },
  { id: "Sg_4Sw-wRMo", region: "texas", tier: 3, start: 403, end: 423, name: "Curtis Parrish", role: "Lubbock County Judge", place: "Lubbock, Texas", lat: 33.5779, lng: -101.8552, verified: false,
    words: [["my", 0.6], ["i", 1.5], ["ten", 6.6]],
    note: "West Texas English. A Southern base, flattened and widened by the plains: \"pin\" and \"pen\" merge, and \"I\" stretches out." }
];
