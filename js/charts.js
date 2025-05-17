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

function drawSouthChart(x, y, w, h, planetDetails, currentDate, currentTime, currentCity) {
  const mx = w / 4;
  const my = h / 4;
  let s = '<g>\n';

  const glyphMapping = {
    'லக்னம்': 'லக்',
    'சூரியன்': 'சூரி',
    'சந்திரன்': 'சந்',
    'செவ்வாய்': 'செவ்',
    'புதன்': 'புத',
    'குரு': 'குரு',
    'சுக்கிரன்': 'சுக்',
    'சனி': 'சனி',
    'ராகு': 'ராகு',
    'கேது': 'கேது',
    'மாந்தி': 'மா',
  };

  let housePlanets = Array.from({length: 12}, () => []);

  planetDetails.forEach((planet) => {
    const houseIndex = Math.floor((planet.longitude % 360) / 30);
    const glyph = glyphMapping[planet.name] || planet.name;
    const degree = Math.ceil(planet.longitude % 30); // Round up to whole number
    housePlanets[houseIndex].push({ glyph, degree });
  });

  // Sort planets in each house as specified
  for (let i = 0; i < 12; i++) {
    if (i <= 5) { // Mesha to Kanya (Aries to Virgo)
      housePlanets[i].sort((a, b) => a.degree - b.degree); // Ascending
    } else { // Tula to Meena (Libra to Pisces)
      housePlanets[i].sort((a, b) => b.degree - a.degree); // Descending
    }
  }

  let lagnaIndex = null;
  const ascPlanet = planetDetails.find(p => p.name === 'லக்னம்');
  if (ascPlanet && !isNaN(ascPlanet.longitude)) {
    lagnaIndex = Math.floor((ascPlanet.longitude % 360) / 30);
  }

  const mod12 = (num) => ((num % 12) + 12) % 12;
  let house4, house5, house7, house9, house10;
  if (lagnaIndex !== null) {
    house4 = mod12(lagnaIndex + 3);
    house5 = mod12(lagnaIndex + 4);
    house7 = mod12(lagnaIndex + 6);
    house9 = mod12(lagnaIndex + 8);
    house10 = mod12(lagnaIndex + 9);
  }

  housePositions.forEach((pos, index) => {
    const xd = x + pos.col * mx;
    const yd = y + pos.row * my;
    let fillColor = 'none';
    if (lagnaIndex !== null) {
      if (index === lagnaIndex) {
        fillColor = '#bbeeee';
      } else if (index === house4 || index === house7 || index === house10) {
        fillColor = '#e0f7fa';
      } else if (index === house5 || index === house9) {
        fillColor = '#e8f6e9';
      }
    }
    s += `<rect x="${xd}" y="${yd}" width="${mx}" height="${my}" style="fill:${fillColor};stroke:black;stroke-width:2"/>\n`;
  });

  const rowHeight = 20;
  for (let i = 0; i < 12; i++) {
    const planets = housePlanets[i];
    if (planets.length > 0) {
      const pos = housePositions[i];
      const cellX = x + pos.col * mx;
      const cellY = y + pos.row * my;
      const totalGridHeight = planets.length * rowHeight;
      const verticalOffset = (my - totalGridHeight) / 2;
      for (let j = 0; j < planets.length; j++) {
        const glyphX = cellX + (mx * 0.35);
        const degreeX = cellX + (mx * 0.75);
        const glyphY = cellY + verticalOffset + (j * rowHeight) + (rowHeight / 2);
        // Planet Glyph
        s += `<text x="${glyphX}" y="${glyphY}" fill="black" font-size="18" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${planets[j].glyph}</text>\n`;
        // Planet Degree (rounded up)
        s += `<text x="${degreeX}" y="${glyphY}" fill="black" font-size="14" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${planets[j].degree}°</text>\n`;
      }
    }
  }

  const centerX = x + w / 2;
  const centerY = y + h / 2;
  s += `<text x="${centerX}" y="${centerY - 20}" fill="black" font-size="11" font-family="monospace" text-anchor="middle">ஸ்ரீ கற்பக விநாயகர் துணை</text>\n`;
  s += `<text x="${centerX}" y="${centerY}" fill="blue" font-size="15" font-family="monospace" font-weight="bold" text-anchor="middle">ராசி</text>\n`;
  s += `<text x="${centerX}" y="${centerY + 20}" fill="black" font-size="16" font-family="monospace" text-anchor="middle">${currentDate}</text>\n`;
  s += `<text x="${centerX}" y="${centerY + 40}" fill="black" font-size="16" font-family="monospace" text-anchor="middle">${currentTime}</text>\n`;
  s += `<text x="${centerX}" y="${centerY + 60}" fill="black" font-size="14" font-family="monospace" text-anchor="middle">${currentCity}</text>\n`;
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
    'மாந்தி': 'மா',

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
  s += `<text x="${centerX}" y="${centerY}" fill="blue" font-size="16" font-family="monospace" font-weight="bold" font-color="blue" text-anchor="middle">நவாம்சம்</text>\n`;
  s += '</g>\n';
  return s;
}

/**
 * Display the main (Rasi) chart in an SVG container.
 */
function displayChart(planetaryPositions, year, month, day, hour, minutes) {
  let currentDate = day + '-' + month + '-' + year;
  let currentTime = formatAMPM(hour, minutes);
  let selectedCity = document.getElementById('city').value;
  let currentCity = cityTamilNames[selectedCity] || selectedCity; // fallback to English if Tamil not found

  let svgContent = drawSouthChart(0, 0, 400, 400, planetaryPositions, currentDate, currentTime, currentCity);
  document.getElementById('chartContainer').innerHTML =
    '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
    svgContent + '</svg>';
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
