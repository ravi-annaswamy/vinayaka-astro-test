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

/**
 * Calculate the Nakshatra name (Tamil) and Pada from a given degree.
 * @param {number} degree - Planetary longitude in degrees.
 * @returns {{nakshatra: string, pada: number}} 
 */
function calculateNakshatraPada(degree) {
  const degreesPerNakshatra = 40 / 3;  // exactly 13.3333...
  const degreesPerPada = 10 / 3;       // exactly 3.3333...

  const nakshatraIndex = Math.floor(degree / degreesPerNakshatra) % 27;
  const pada = Math.floor((degree % degreesPerNakshatra) / degreesPerPada) + 1;

  const nakshatraName = nakshatraNamesTamil[nakshatraIndex];
  return { nakshatra: nakshatraName, pada: pada };
}

/**
 * Calculate the Navamsa position index (0-11) for a given longitude.
 * @param {number} longitude - Planetary longitude.
 * @returns {number} navamsaSign - Index from 0 to 11 representing the navamsa sign.
 */
function calculateNavamsaPosition(longitude) {
  // Determine which sign the planet is in (0-11)
  let sign = Math.floor(longitude / 30);
  // Position within that sign (0 to <30)
  let posInSign = longitude % 30;
  // Navamsa division within the sign
  let navamsa = Math.floor(posInSign / 3.333);
  // Final navamsa sign index
  let navamsaSign = (sign * 9 + navamsa) % 12;
  return navamsaSign;
}

/* 
   House layout for a standard South Indian chart.
   Each house index (0-11) points to row/col coords for drawing.
*/
var housePositions = [
  { row: 0, col: 1 }, // Aries
  { row: 0, col: 2 }, // Taurus
  { row: 0, col: 3 }, // Gemini
  { row: 1, col: 3 }, // Cancer
  { row: 2, col: 3 }, // Leo
  { row: 3, col: 3 }, // Virgo
  { row: 3, col: 2 }, // Libra
  { row: 3, col: 1 }, // Scorpio
  { row: 3, col: 0 }, // Sagittarius
  { row: 2, col: 0 }, // Capricorn
  { row: 1, col: 0 }, // Aquarius
  { row: 0, col: 0 }  // Pisces
];

/**
 * Draws the South Indian Rasi chart (in SVG) at specified coords and size.
 * Highlights houses 4,7,10 from Lagna in light blue, houses 5,9 from Lagna in light green,
 * and the Lagna house itself in light blue-green.
 * @param {number} x - Top-left x offset.
 * @param {number} y - Top-left y offset.
 * @param {number} w - Chart width.
 * @param {number} h - Chart height.
 * @param {Array} planetDetails - Planet info array.
 * @param {string} currentDate - String for the current date.
 * @param {string} currentTime - String for the current time.
 * @returns {string} An SVG string representing the chart.
 */
function drawSouthChart(x, y, w, h, planetDetails, currentDate, currentTime) {
  const mx = w / 4;  // width of each house
  const my = h / 4;  // height of each house
  let s = '<g>\n';
  
  // Glyph mapping: key = full name from planetDetails, value = new glyph.
  const glyphMapping = {
    'லக்னம்': 'லக்',
    'சூரியன்':  'சூரி',
    'சந்திரன்':  'சந்',
    'செவ்வாய்': 'செவ்',
    'புதன்': 'புத',
    'குரு': 'குரு',
    'சுக்கிரன்':  'சுக்',
    'சனி': 'சனி',
    'ராகு': 'ராகு',
    'கேது': 'கேது',
  };

  // Create an array (for 12 houses) to group glyphs.
  let housePlanets = [];
  for (let i = 0; i < 12; i++) {
    housePlanets.push([]);
  }
  
  // Group each planet’s glyph into its corresponding house.
  planetDetails.forEach((planet) => {
    const houseIndex = Math.floor((planet.longitude % 360) / 30);
    const glyph = glyphMapping[planet.name] || planet.name;
    housePlanets[houseIndex].push(glyph);
  });

  // Identify Lagna's house index (if available) for background color highlights.
  let lagnaIndex = null;
  const ascPlanet = planetDetails.find(p => p.name === 'லக்னம்');
  if (ascPlanet && !isNaN(ascPlanet.longitude)) {
    lagnaIndex = Math.floor((ascPlanet.longitude % 360) / 30);
  }
  
  // Helper function for mod 12 and define special houses.
  const mod12 = (num) => ((num % 12) + 12) % 12;
  let house4, house5, house7, house9, house10;
  if (lagnaIndex !== null) {
    house4 = mod12(lagnaIndex + 3);
    house5 = mod12(lagnaIndex + 4);
    house7 = mod12(lagnaIndex + 6);
    house9 = mod12(lagnaIndex + 8);
    house10 = mod12(lagnaIndex + 9);
  }

  // Draw the chart houses (rectangles) with the same background rules.
  housePositions.forEach((pos, index) => {
    const xd = x + pos.col * mx;
    const yd = y + pos.row * my;
    let fillColor = 'none';
    if (lagnaIndex !== null) {
      if (index === lagnaIndex) {
        fillColor = '#bbeeee'; // Lagna house: light blue-green
      } else if (index === house4 || index === house7 || index === house10) {
        fillColor = '#e0f7fa'; // Houses 4, 7, 10: light blue
      } else if (index === house5 || index === house9) {
        fillColor = '#e8f6e9'; // Houses 5, 9: light green
      }
    }
    s += `<rect x="${xd}" y="${yd}" width="${mx}" height="${my}" style="fill:${fillColor};stroke:black;stroke-width:2"/>\n`;
  });
  
  // For each house, layout the glyphs in a two-column grid centered in the cell.
  const rowHeight = 22; // vertical space for each row
  for (let i = 0; i < 12; i++) {
    const glyphs = housePlanets[i];
    if (glyphs.length > 0) {
      const pos = housePositions[i];
      const cellX = x + pos.col * mx;
      const cellY = y + pos.row * my;
      const numRows = Math.ceil(glyphs.length / 2);
      const totalGridHeight = numRows * rowHeight;
      const verticalOffset = (my - totalGridHeight) / 2;
      for (let j = 0; j < glyphs.length; j++) {
        const row = Math.floor(j / 2);
        const col = j % 2;
        const glyphX = (glyphs.length === 1) ? cellX + (mx / 2) : cellX + (col === 0 ? (mx * 0.30) : (mx * 0.70));
        const glyphY = cellY + verticalOffset + (row * rowHeight) + (rowHeight / 2);
        // s += `<text x="${glyphX}" y="${glyphY}" fill="black" font-size="16" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${glyphs[j]}</text>\n`;
        s += `<text x="${glyphX}" y="${glyphY}" fill="black" font-size="18" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${glyphs[j]}</text>\n`;

      }
    }
  }
  
  // Center the chart title and date/time information.
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  s += `<text x="${centerX}" y="${centerY - 20}" fill="black" font-size="12" font-family="monospace" text-anchor="middle">ஸ்ரீ கற்பக விநாயகர் துணை</text>\n`;
  s += `<text x="${centerX}" y="${centerY}" fill="black" font-size="16" font-family="monospace" text-anchor="middle">ராசி</text>\n`;
  s += `<text x="${centerX}" y="${centerY + 20}" fill="black" font-size="16" font-family="monospace" text-anchor="middle">${currentDate}</text>\n`;
  s += `<text x="${centerX}" y="${centerY + 40}" fill="black" font-size="16" font-family="monospace" text-anchor="middle">${currentTime}</text>\n`;
  s += '</g>\n';
  return s;
}


/**
 * Draws the Navamsa chart (in SVG).
 * @param {number} x - Top-left x offset.
 * @param {number} y - Top-left y offset.
 * @param {number} w - Chart width.
 * @param {number} h - Chart height.
 * @param {Array} planetDetails - Planet info array.
 * @returns {string} An SVG string representing the Navamsa chart.
 */
function drawNavamsaChart(x, y, w, h, planetDetails) {
  const mx = w / 4; // width of each house
  const my = h / 4; // height of each house
  let s = '<g>\n';
  
  // Glyph mapping: key = full name, value = new glyph.
  const glyphMapping = {
    'லக்னம்': 'லக்',
    'சூரியன்':  'சூரி',
    'சந்திரன்':  'சந்',
    'செவ்வாய்': 'செவ்',
    'புதன்': 'புத',
    'குரு': 'குரு',
    'சுக்கிரன்':  'சுக்',
    'சனி': 'சனி',
    'ராகு': 'ராகு',
    'கேது': 'கேது',
  };

  // Create an array (for 12 houses) to group glyphs by navamsa.
  let housePlanets = [];
  for (let i = 0; i < 12; i++) {
    housePlanets.push([]);
  }
  
  // Group each planet’s glyph into its corresponding navamsa house.
  planetDetails.forEach((planet) => {
    let navamsaSign = calculateNavamsaPosition(planet.longitude);
    const glyph = glyphMapping[planet.name] || planet.name;
    housePlanets[navamsaSign].push(glyph);
  });

  // Draw the chart grid (houses).
  housePositions.forEach((pos) => {
    const xd = x + pos.col * mx;
    const yd = y + pos.row * my;
    s += `<rect x="${xd}" y="${yd}" width="${mx}" height="${my}" style="fill:none;stroke:black;stroke-width:2"/>\n`;
  });
  
  // For each house, layout the glyphs in a two-column grid centered in the cell.
  const rowHeight = 22; // vertical space for each row
  for (let i = 0; i < 12; i++) {
    const glyphs = housePlanets[i];
    if (glyphs.length > 0) {
      const pos = housePositions[i];
      const cellX = x + pos.col * mx;
      const cellY = y + pos.row * my;
      const numRows = Math.ceil(glyphs.length / 2);
      const totalGridHeight = numRows * rowHeight;
      const verticalOffset = (my - totalGridHeight) / 2;
      for (let j = 0; j < glyphs.length; j++) {
        const row = Math.floor(j / 2);
        const col = j % 2;
        const glyphX = (glyphs.length === 1) ? cellX + (mx / 2) : cellX + (col === 0 ? (mx * 0.30) : (mx * 0.70));
        const glyphY = cellY + verticalOffset + (row * rowHeight) + (rowHeight / 2);
        s += `<text x="${glyphX}" y="${glyphY}" fill="black" font-size="18" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${glyphs[j]}</text>\n`;
      }
    }
  }
  
  // Center the Navamsa chart label.
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  s += `<text x="${centerX}" y="${centerY}" fill="black" font-size="16" font-family="monospace" text-anchor="middle">நவாம்சம்</text>\n`;
  s += '</g>\n';
  return s;
}

/**
 * Format hour/minute into a 12-hour AM/PM string.
 * @param {number} hour - 0..23
 * @param {number} minute - 0..59
 * @returns {string} Example: "1:05 PM"
 */
function formatAMPM(hour, minute) {
  let ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  minute = minute < 10 ? '0' + minute : minute;
  let strTime = hour + ':' + minute + ' ' + ampm;
  return strTime;
}

/**
 * Return array of signs (1-based) for each planet from raw positions.
 * p is assumed to have 10 elements for 10 planets/points.
 */
function chPlanets(p) {
  let sg = new Array(10);
  for (let i = 0; i < 10; i++) {
    sg[i] = parseInt(Math.floor(p[i]) / 30) + 1;
  }
  return sg;
}

/**
 * Returns city info (latitude, longitude, timezone) for known cityName.
 * If not found, returns null.
 */
function getCityInfo(cityName) {
  const cityData = {
    'Chennai': {
      latitude: { degrees: 13, minutes: 5, direction: 'N' },
      longitude: { degrees: 80, minutes: 17, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Vellore': {
      latitude: { degrees: 12, minutes: 56, direction: 'N' },
      longitude: { degrees: 79, minutes: 8, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Salem': {
      latitude: { degrees: 11, minutes: 40, direction: 'N' },
      longitude: { degrees: 78, minutes: 9, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Coimbatore': {
      latitude: { degrees: 11, minutes: 0, direction: 'N' },
      longitude: { degrees: 76, minutes: 57, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Krishnagiri': {
      latitude: { degrees: 12, minutes: 31, direction: 'N' },
      longitude: { degrees: 78, minutes: 12, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Tirunelveli': {
      latitude: { degrees: 8, minutes: 44, direction: 'N' },
      longitude: { degrees: 77, minutes: 41, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Kanyakumari': {
      latitude: { degrees: 8, minutes: 5, direction: 'N' },
      longitude: { degrees: 77, minutes: 32, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Tiruchirappalli': {
      latitude: { degrees: 10, minutes: 49, direction: 'N' },
      longitude: { degrees: 78, minutes: 40, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Madurai': {
      latitude: { degrees: 9, minutes: 55, direction: 'N' },
      longitude: { degrees: 78, minutes: 7, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Hyderabad': {
      latitude: { degrees: 17, minutes: 23, direction: 'N' },
      longitude: { degrees: 78, minutes: 27, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Bengaluru': {
      latitude: { degrees: 12, minutes: 58, direction: 'N' },
      longitude: { degrees: 77, minutes: 36, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'Thiruvananthapuram': {
      latitude: { degrees: 8, minutes: 29, direction: 'N' },
      longitude: { degrees: 76, minutes: 57, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'New Delhi': {
      latitude: { degrees: 28, minutes: 38, direction: 'N' },
      longitude: { degrees: 77, minutes: 13, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' }
    },
    'New York, NY': {
      latitude: { degrees: 40, minutes: 43, direction: 'N' },
      longitude: { degrees: 74, minutes: 0, direction: 'W' },
      timezone: { hours: 4, minutes: 0, direction: 'W' }
    },
    'Westlake, OH': {
      latitude: { degrees: 41, minutes: 27, direction: 'N' },
      longitude: { degrees: 81, minutes: 55, direction: 'W' },
      timezone: { hours: 4, minutes: 0, direction: 'W' }
    }
    // Additional cities can be added here...
  };

  return cityData[cityName] || null;
}

/**
 * Calculate planetary positions given the time t, timeData, and city info.
 * @param {number} t - (Possibly) Julian day or other time factor.
 * @param {Object} timeData - Contains .time etc.
 * @param {Object} cityInfo - Contains lat/lon/timezone data.
 * @returns {Array} Planetary positions array with name, nakshatraPada, etc.
 */
function calculatePlanetaryPositions(t, timeData, cityInfo) {
  let lon = parseFloat(cityInfo.longitude.degrees) + parseFloat(cityInfo.longitude.minutes / 60);
  if (cityInfo.longitude.direction === 'E') {
    lon *= -1;
  }
  let lat = parseFloat(cityInfo.latitude.degrees) + parseFloat(cityInfo.latitude.minutes / 60);
  if (cityInfo.latitude.direction === 'S') {
    lat *= -1;
  }

  // Ascendant calculation
  let as = ascendant(t, timeData.time, lon, lat); // user-provided ascendant() function
  let pp = new Array(10);
  pp[0] = as;

  // Populate other planet positions
  planets(t, pp, 1); // user-provided planets() function

  // Determine sign indices for each planet
  let signIndices = chPlanets(pp);

  let planetaryPositions = [];
  let planetsEng = ['Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  let planetsTamil = ['லக்னம்', 'சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி', 'ராகு', 'கேது'];

  for (let i = 0; i < planetsEng.length; i++) {
    let longitude = (pp[i] !== undefined && !isNaN(pp[i])) ? pp[i].toFixed(1) : 'N/A';
    let degreeInSign = (pp[i] !== undefined && !isNaN(pp[i])) ? (pp[i] % 30).toFixed(1) : 'N/A';
    let zodiacSign = signIndices[i] ? indianZodiacTamil[signIndices[i] - 1] : 'N/A';
    let nakshatraPada = (pp[i] !== undefined && !isNaN(pp[i]))
      ? calculateNakshatraPada(pp[i])
      : { nakshatra: 'N/A', pada: 'N/A' };
    let nakshatraIndex = Math.floor(pp[i] / 13.33);
    let nakshatraLord = nakshatraLordsTamil[nakshatraIndex % 27];
    let houseNumber = (signIndices[i] - signIndices[0] + 12) % 12 + 1;

    planetaryPositions.push({
      name: planetsTamil[i],
      nakshatraPada: nakshatraPada.nakshatra + ' ' + nakshatraPada.pada,
      zodiacSign: zodiacSign,
      degree: degreeInSign,
      longitude: parseFloat(longitude),
      nakshatraLord: nakshatraLord,
      houseNumber: houseNumber
    });
  }

  return planetaryPositions;
}

/**
 * Display the main (Rasi) chart in an SVG container.
 */
function displayChart(planetaryPositions, year, month, day, hour, minutes) {
  let currentDate = day + '-' + month + '-' + year;
  let currentTime = formatAMPM(hour, minutes);

  let svgContent = drawSouthChart(0, 0, 400, 400, planetaryPositions, currentDate, currentTime);
  document.getElementById('chartContainer').innerHTML =
    '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
    svgContent + '</svg>';
}

/**
 * Compute Navamsa positions from the main planetary positions array.
 * Sort them by ascending longitude so they appear in an ordered manner.
 */
function calculateNavamsaPositions(planetaryPositions) {
  return planetaryPositions.map((planet) => {
    let navamsaSign = calculateNavamsaPosition(planet.longitude);
    let navamsaSignName = indianZodiacTamil[navamsaSign];
    return { ...planet, navamsaSign: navamsaSignName };
  });
}

/**
 * Display the Navamsa chart in an SVG container.
 */
function displayNavamsaChart(navamsaPositions) {
  navamsaPositions.sort((a, b) => a.longitude - b.longitude);

  let navamsaSvgContent = drawNavamsaChart(0, 0, 400, 400, navamsaPositions);
  document.getElementById('navamsaChartContainer').innerHTML =
    '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
    navamsaSvgContent + '</svg>';
}

// --------------------------------------------------------------------
// Retrograde / dignity code (sample additions)
// --------------------------------------------------------------------

/**
 * Check if planet is retrograde by comparing two longitudes at two times.
 * If planet moves backward from currentDeg to laterDeg, returns true.
 */
function isRetrograde(currentDeg, laterDeg) {
  let diff = laterDeg - currentDeg;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (diff < 0);
}

/**
 * Map from Tamil sign name to index (1-12).
 */
function signNameToIndex(signName) {
  const signMap = {
    'மேஷம்': 1,
    'ரிஷபம்': 2,
    'மிதுனம்': 3,
    'கடகம்': 4,
    'சிம்மம்': 5,
    'கன்னி': 6,
    'துலாம்': 7,
    'விருச்சிகம்': 8,
    'தனுசு': 9,
    'மகரம்': 10,
    'கும்பம்': 11,
    'மீனம்': 12
  };
  return signMap[signName] || 0;
}

/* 
   Defines planet dignities for main Grahas except Rahu/Ketu.
   rulership: array of sign indexes (1..12).
   exaltation: single sign index, 
   debilitation: single sign index.
*/
const planetDignities = {
  'சூரியன்': { rulership: [5], exaltation: 1, debilitation: 7 },
  'சந்திரன்': { rulership: [4], exaltation: 2, debilitation: 8 },
  'செவ்வாய்': { rulership: [1, 8], exaltation: 10, debilitation: 4 },
  'புதன்': { rulership: [3, 6], exaltation: 6, debilitation: 12 },
  'குரு': { rulership: [9, 12], exaltation: 4, debilitation: 10 },
  'சுக்கிரன்': { rulership: [2, 7], exaltation: 12, debilitation: 6 },
  'சனி': { rulership: [10, 11], exaltation: 7, debilitation: 1 }
};

/**
 * Returns a dignity string ("ஆட்சி", "உச்சம்", "நீசம்", or "-") for the 
 * given planetName in the given signIndex (1..12).
 */
function getDignity(planetName, signIndex) {
  if (planetName === 'ராகு' || planetName === 'கேது') return '-';
  let pd = planetDignities[planetName];
  if (!pd) return '-';

  if (pd.rulership.includes(signIndex)) return 'ஆட்சி';
  if (signIndex === pd.exaltation) return 'உச்சம்';
  if (signIndex === pd.debilitation) return 'நீசம்';
  return '-';
}

/**
 * Creates an HTML table of planetary info, checking for retrograde and dignity.
 * planetaryPositions = array at time1
 * planetaryPositionsLater = array at a slightly later time to check retrograde
 */
function displayPlanetaryTable(planetaryPositions, planetaryPositionsLater) {
  // Sort by houseNumber, then longitude
  planetaryPositions.sort((a, b) => a.houseNumber - b.houseNumber || a.longitude - b.longitude);
  planetaryPositionsLater.sort((a, b) => a.houseNumber - b.houseNumber || a.longitude - b.longitude);

  let table = `
    <table>
      <tr>
        <th>பாவகம்</th>
        <th>கிரகம்</th>
        <th>நிலை</th>
        <th>நட்சத்திரம் <br> பாதம்</th>
        <th>நட்சத்திர <br>அதிபதி</th>
        <th>பாகை</th>
      </tr>
  `;

  planetaryPositions.forEach((planet) => {
    // Find the same planet in the "later" array
    const planetLater = planetaryPositionsLater.find(p => p.name === planet.name);
    let retroSymbol = '';

    // Check retrograde for all except Rahu/Ketu
    if (planet.name !== 'ராகு' && planet.name !== 'கேது' && planetLater) {
      if (isRetrograde(planet.longitude, planetLater.longitude)) {
        retroSymbol = '(வ)'; // marker for retrograde
      }
    }

    // Dignity
    let signIndex = signNameToIndex(planet.zodiacSign);
    let dignity = getDignity(planet.name, signIndex);

    table += `
      <tr>
        <td>${planet.houseNumber}</td>
        <td>${planet.name} ${retroSymbol}</td>
        <td>${dignity}</td>
        <td>${planet.nakshatraPada}</td>
        <td>${planet.nakshatraLord}</td>
        <td>${Math.floor(planet.longitude)}</td>
      </tr>
    `;
  });

  table += '</table>';
  document.getElementById('result').innerHTML = table;
}

// --------------------------------------------------------------------
// Basic Dasha code for Tam:
// --------------------------------------------------------------------

function getDashas(jd, nd) {
  let s = '<div style="font-family: monospace">';
  s += '<p>---Vimshottari Doshas---</p>';
  s += '</div>';
  s += '<div><span style="font-family: monospace">';

  for (let yd = 0, xoff = 0, cnt = 0, nt = nd, idx = getdashastart(), i = 0; i < 9; i++) {
    s += dlnam[nt] + ' Dasha:<br>';
    for (let j = 0; j < 9 && (s += bhuktistring(nd, idx, jd) + '&nbsp;&nbsp;', ++idx % 9 !== 0); j++) {
      if (j % 3 === 2) s += '<br>';
    }
    s += '<br>';
    if (++nt === 9) nt = 0;
  }
  return s + '</div>';
}

function getDashasTam(jd, nd) {
  let s = '<div style="font-family: monospace">';
  s += '<p>---தசாபுக்தி துவக்கங்கள்---</p>';
  s += '</div>';
  s += '<div><span style="font-family: monospace">';

  for (let yd = 0, xoff = 0, cnt = 0, nt = nd, idx = getdashastart(), i = 0; i < 9; i++) {
    s += dlnamtam[nt] + ' தசை:<br>';
    for (let j = 0; j < 9 && (s += bhuktistring(nd, idx, jd) + '&nbsp;&nbsp;', ++idx % 9 !== 0); j++) {
      if (j % 3 === 2) s += '<br>';
    }
    s += '<br>';
    if (++nt === 9) nt = 0;
  }
  return s + '</div>';
}

/**
 * Uses Moon's position in degrees to populate dlist[] with dasha offsets.
 * @param {number} moonpos
 * @returns {number} natal_dasha 
 */
function calcdasha(moonpos) {
  let moonmins = Math.floor(60 * moonpos);
  let natal_dasha = Math.floor(moonmins / 800) % 9;
  let elapsed = (moonmins % 800) / 800 * dashyr[natal_dasha] * 365.25;
  let m = natal_dasha;
  let idx = 0;
  let days_into = 0;

  for (let d = 0; d < 9; d++) {
    let dlen = 365.25 * dashyr[m];
    let bp = m;

    for (let b = 0; b < 9; b++) {
      let blen = (dashyr[bp] / 120) * dlen;
      dlist[idx] = Math.floor(days_into - elapsed);
      idx++;
      days_into += blen;
      if (++bp === 9) bp = 0;
    }
    if (++m === 9) m = 0;
  }
  return natal_dasha;
}

/**
 * Return the index in dlist[] that is closest to birth time
 * (i.e., the first positive offset).
 */
function getdashastart() {
  let dstart = 0;
  while (dlist[dstart] < 0) {
    dstart++;
  }
  dstart--;
  if (dstart < 0) dstart = 0;
  return dstart;
}

/**
 * Find the current dasha index for a given offsetNow in days.
 */
function findCurrentDashaIndex(dashas, offsetNow) {
  for (let i = 0; i < dashas.length; i++) {
    let start = dashas[i].startOffset;
    let end = dashas[i].endOffset !== null ? dashas[i].endOffset : 99999999;
    if (start <= offsetNow && offsetNow < end) {
      return i;
    }
  }
  return -1;
}

// Build a data structure of dashas + sub-lords from the dlist array
function buildDashaData(birthJD, natalDashaIndex) {
  // dlnamtam = ["கேது","சுக்கிரன்","சூரியன்","சந்திரன்","செவ்வாய்","ராகு","குரு","சனி","புதன்"];
  const dashas = [];
  for (let i = 0; i < 9; i++) {
    let mLordIndex = (natalDashaIndex + i) % 9;
    let mLordName = dlnamtam[mLordIndex];

    let startOffset = dlist[i * 9];
    let endOffset = (i < 8) ? dlist[(i + 1) * 9] : null;

    // sub-lords
    let subLords = [];
    let bp = mLordIndex;
    for (let j = 0; j < 9; j++) {
      subLords.push({
        lord: dlnamtam[bp],
        startOffset: dlist[i * 9 + j],
        endOffset: (j < 8) ? dlist[i * 9 + j + 1] : endOffset
      });
      bp = (bp + 1) % 9;
    }

    dashas.push({
      lord: mLordName,
      startOffset: startOffset,
      endOffset: endOffset,
      subLords: subLords
    });
  }
  return dashas;
}

/**
 * Generate side-by-side HTML tables for Mahadasha & Bhukti details.
 */
function makeDashaTables(dashas, birthJD, offsetNow) {
  let currIdx = findCurrentDashaIndex(dashas, offsetNow);

  let dashaTable = '<h4>தசை வரிசை</h4>' +
                   '<table><thead><tr>' +
                   '<th>மகாதசை</th>' +
                   '<th>தொடக்கம்</th>' +
                   '<th>முடிவு</th>' +
                   '</tr></thead><tbody>';

  for (let i = 0; i < dashas.length; i++) {
    let startDate = (dashas[i].startOffset !== null)
      ? jul2dateDDMMYYYY(birthJD + dashas[i].startOffset)
      : '---';
    let endDate = (dashas[i].endOffset !== null)
      ? jul2dateDDMMYYYY(birthJD + dashas[i].endOffset)
      : '---';

    let rowStyle = (i === currIdx) ? ' style="background-color: #ccffcc;"' : '';

    dashaTable += '<tr' + rowStyle + '>' +
                  '<td>' + dashas[i].lord + '</td>' +
                  '<td>' + startDate + '</td>' +
                  '<td>' + endDate + '</td>' +
                  '</tr>';
  }
  dashaTable += '</tbody></table>';

  // Current Mahadasha's Bhukti table
  let bhuktiTable = '';
  if (currIdx === -1) {
    // No current dasha
    bhuktiTable = '<table><thead><tr><th colspan="3">தற்போதைய தசை ஏதுமில்லை</th></tr></thead></table>';
  } else {
    let subs = dashas[currIdx].subLords;
    let currentDashaLord = dashas[currIdx].lord;

    let currBhukti = -1;
    for (let j = 0; j < subs.length; j++) {
      let sStart = subs[j].startOffset ?? 999999;
      let sEnd = subs[j].endOffset ?? 999999;
      if (sStart <= offsetNow && offsetNow < sEnd) {
        currBhukti = j;
        break;
      }
    }

    bhuktiTable = '<h4>' + currentDashaLord + ' தசாபுக்தி வரிசை</h4>' +
                  '<table><thead><tr>' +
                  '<th>புக்தி</th>' +
                  '<th>தொடக்கம்</th>' +
                  '<th>முடிவு</th>' +
                  '</tr></thead><tbody>';

    for (let j = 0; j < subs.length; j++) {
      let subStart = (subs[j].startOffset !== null)
        ? jul2dateDDMMYYYY(birthJD + subs[j].startOffset)
        : '---';
      let subEnd = (subs[j].endOffset !== null)
        ? jul2dateDDMMYYYY(birthJD + subs[j].endOffset)
        : '---';

      let rowStyle = (j === currBhukti) ? ' style="background-color: #ccffcc;"' : '';
      bhuktiTable += '<tr' + rowStyle + '>' +
                     '<td>' + subs[j].lord + '</td>' +
                     '<td>' + subStart + '</td>' +
                     '<td>' + subEnd + '</td>' +
                     '</tr>';
    }
    bhuktiTable += '</tbody></table>';
  }

  // Return side-by-side in a container
  return '<div class="dasha-container">' +
           '<div class="dasha-item">' + dashaTable + '</div>' +
           '<div class="dasha-item">' + bhuktiTable + '</div>' +
         '</div>';}

/**
 * Example function to display dashas in older style.
 */
function displayDashasOld(planetaryPositions, jd) {
  let moon = planetaryPositions.find(p => p.name === 'சந்திரன்');
  if (!moon) {
    document.getElementById('dashasContainer').innerHTML = 'Moon position not found.';
    return;
  }
  let nd = calcdasha(moon.longitude);
  let dashasHtml = getDashasTam(jd, nd);
  document.getElementById('dashasContainer').innerHTML = dashasHtml;
}

/**
 * Final display function for dashas using the new approach.
 */
function displayDashas(planetaryPositions, birthJD) {
  let moon = planetaryPositions.find(p => p.name === 'சந்திரன்');
  if (!moon) {
    document.getElementById('dashasContainer').innerHTML = 'Moon position not found.';
    return;
  }
  let nd = calcdasha(moon.longitude); // sets up dlist array
  let dashas = buildDashaData(birthJD, nd);
  let todayJD = getSystemJD();
  let offsetNow = todayJD - birthJD;
  let html = makeDashaTables(dashas, birthJD, offsetNow);
  document.getElementById('dashasContainer').innerHTML = html;
}

// --------------------------------------------------------------------
// Additional utility functions used in the code
// (Assuming date2jul(), ascendant(), planets(), etc. are defined externally.)
// --------------------------------------------------------------------

function calcnavamsha(ppos) {
  let darray = new Array(10);
  for (let i = 0; i < 10; i++) {
    let m = Math.floor(60 * ppos[i]);
    m /= 200;
    darray[i] = Math.floor(m % 12);
  }
  return darray;
}

function drawline(x, y, x2, y2) {
  return '<line x1="' + x + '" y1="' + y +
         '" x2="' + x2 + '" y2="' + y2 + '"/>\n';
}

function drawstring(text, fontsize, color, x, y) {
  return '<text x="' + x + 
         '" y="' + y + 
         '" fill="' + color + 
         '" font-size="' + fontsize + 
         '" font-family="monospace">' + text + '</text>\n';
}

/**
 * Returns a short string for the Bhukti from the dlist array.
 */
function bhuktistring(natal, idx, bd) {
  let bi = dlist[idx];
  if (dlist[idx] < 0) bi = 0;
  let bk = (Math.floor(natal + idx / 9) % 9 + idx) % 9;
  return dlstr.substr(2 * bk, 2) + ' ' + jul2date(bd + bi);
}

/**
 * Prints sign data (internal debugging function).
 */
function prtdsm(v) {
  let d = Math.floor(v % 30);
  let z = zdstr.substr(2 * Math.floor(v / 30), 2);
  let m = Math.floor((60 * v) % 60);
  let str = '0' + d + z;
  if (d > 9) str = d + z;
  str += (m > 9) ? m : '0' + m;
  str += ' ' + nakstr.substr(3 * Math.floor((60 * v) / 800), 3);
  str += ' ' + dlstr.substr(2 * Math.floor((60 * v) / 800 % 9), 2);
  return str;
}

function pagehdr() {
  let s = '<!DOCTYPE html><html>';
  s += '<head><style>.left{ float:left; }</style></head>';
  s += '<body>';
  return s;
}

function pageftr() {
  return '</body></html>';
}

/**
 * Converts Julian day to "YYYY-MM-DD".
 */
function jul2date(jd) {
  let date = new Date(86400000 * (jd - 2440587.5));
  let m = date.getUTCMonth() + 1;
  let d = date.getUTCDate();
  let y = date.getUTCFullYear();
  return y + '-' + m + '-' + d;
}

/**
 * Converts JD to "DD-MM-YYYY".
 */
function jul2dateDDMMYYYY(jd) {
  let date = new Date((jd - 2440587.5) * 86400000);
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  let d = date.getUTCDate();

  let dd = (d < 10) ? '0' + d : d;
  let mm = (m < 10) ? '0' + m : m;
  return dd + '-' + mm + '-' + y;
}

/**
 * Get the system's current Julian day in UTC.
 */
function getSystemJD() {
  let now = new Date();
  let y = now.getUTCFullYear();
  let m = now.getUTCMonth() + 1;
  let d = now.getUTCDate();
  let hour = now.getUTCHours();
  let min = now.getUTCMinutes();
  let jd = date2jul(m, d, y) + (hour + min / 60) / 24.0; // date2jul presumably external
  return jd;
}

// --------------------------------------------------------------------
// Global or additional variables required by the user’s external code
// --------------------------------------------------------------------
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

// End of app3.js
