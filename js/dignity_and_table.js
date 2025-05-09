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
        <th>பாகை</th>
        <th>நிலை</th>
        <th>நட்சத்திரம் <br> பாதம்</th>
        <th>நட்சத்திர <br>அதிபதி</th>
      </tr>
  `;

  planetaryPositions.forEach((planet) => {
    const planetLater = planetaryPositionsLater.find(p => p.name === planet.name);
    let retroSymbol = '';

    if (planet.name !== 'ராகு' && planet.name !== 'கேது' && planetLater) {
      if (isRetrograde(planet.longitude, planetLater.longitude)) {
        retroSymbol = '(வ)';
      }
    }

    let signIndex = signNameToIndex(planet.zodiacSign);
    let dignity = getDignity(planet.name, signIndex);

    // Longitude modulo 30 with degree symbol
    let bhaagai = `${(planet.longitude % 30).toFixed(2)}°`;


    table += `
      <tr>
        <td>${planet.houseNumber}</td>
        <td>${planet.name} ${retroSymbol}</td>
        <td style="text-align:center">${bhaagai}</td>
        <td>${dignity}</td>
        <td>${planet.nakshatraPada}</td>
        <td>${planet.nakshatraLord}</td>
      </tr>
    `;
  });

  table += '</table>';
  document.getElementById('result').innerHTML = table;
}
