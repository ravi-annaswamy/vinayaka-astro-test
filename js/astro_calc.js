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
  console.log(as);

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

function calcnavamsha(ppos) {
  let darray = new Array(10);
  for (let i = 0; i < 10; i++) {
    let m = Math.floor(60 * ppos[i]);
    m /= 200;
    darray[i] = Math.floor(m % 12);
  }
  return darray;
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
