
/* 
  Global variables (chart data, zodiac arrays, etc.)
  Some remain as var for broad scope usage in this file.
*/
var country,
    tzname,
    chName,
    chDate,
    chTime,
    chPlace,
    chZone,
    chLon,
    chLat,
    chStyle,
    atlasData,
    chInfo;


// Western, Indian, and Tamil zodiac sign arrays
var westernZodiac = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];
var indianZodiac = [
  'Mesha',
  'Vrishabha',
  'Mithuna',
  'Karka',
  'Simha',
  'Kanya',
  'Tula',
  'Vrischika',
  'Dhanu',
  'Makara',
  'Kumbha',
  'Meena'
];
var indianZodiacTamil = [
  'மேஷம்',
  'ரிஷபம்',
  'மிதுனம்',
  'கடகம்',
  'சிம்மம்',
  'கன்னி',
  'துலாம்',
  'விருச்சிகம்',
  'தனுசு',
  'மகரம்',
  'கும்பம்',
  'மீனம்'
];

/* 
   Nakshatra names in English and Tamil, 
   plus their lords (planetary rulers).
*/
var nakshatraNames = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
  'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha',
  'Anuradha', 'Jyeshta', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];
var nakshatraNamesTamil = [
  'அஸ்வினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'ஹஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்',
  'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்',
  'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'
];

var planetsTamil = [
  'சூரியன்',
  'சந்திரன்',
  'செவ்வாய்',
  'புதன்',
  'குரு',
  'சுக்கிரன்',
  'சனி',
  'ராகு',
  'கேது',
  'லக்னம்'
];

var nakshatraLordsTamil = [
  'கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு',
  'குரு', 'சனி', 'புதன்',
  'கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு',
  'குரு', 'சனி', 'புதன்',
  'கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு',
  'குரு', 'சனி', 'புதன்'
];

const MAANTI_OFFSETS = {
  0: { day: 156, night: 240 },    // Sunday
  1: { day: 132,  night: 216 },   // Monday
  2: { day: 108, night: 192 },    // Tuesday
  3: { day: 84, night: 336 },    // Wednesday
  4: { day: 60, night: 312 },    // Thursday 
  5: { day: 36, night: 288 },    // Friday
  6: { day: 12, night: 264 },    // Saturday 
};


var sml = false,
    plstr = 'AsSuMoMaMeJuVeSaRaKe',
    zdstr = 'ArTaGeCnLeViLiScSgCpAqPi',
    nakstr = 'AswBhaKriRohMriArdPunPusAslMagP.PU.PHasChiSwaVisAnuJyeMulP.SU.SShrDhaShaP.BU.BRev',
    dlist = new Array(81),
    dashyr = [7, 20, 6, 10, 7, 18, 16, 19, 17],
    dlnam = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'],
    dlnamtam = ['கேது', 'சுக்கிரன்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'ராகு', 'குரு', 'சனி', 'புதன்'],
    dlstr = 'KeVeSuMoMaRaJuSaMe',
    ns = [100, 86, 16, 2, 2, 18, 10, 178, 2, 208, 16, 352, 100, 270, 196, 352, 280, 270, 192, 178, 280, 86, 196, 2];