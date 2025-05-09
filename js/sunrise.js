  /**************** NOAA Sunrise/Sunset Calculation in UTC ****************/
  function deg2rad(deg) {
    return deg * Math.PI / 180;
  }

  function getDayOfYearUTC(date) {
    // day-of-year in UTC, to avoid local offsets
    const startUTC = Date.UTC(date.getUTCFullYear(), 0, 1);
    const msDiff = date.getTime() - startUTC;
    return Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
  }

  function calcSunTimeUTC(dayOfYear, lat, lng, isSunrise) {
    const lngHour = lng / 15.0;
    const t = (isSunrise)
      ? dayOfYear + ((6 - lngHour) / 24)
      : dayOfYear + ((18 - lngHour) / 24);

    // Mean anomaly
    const M = (0.9856 * t) - 3.289;

    // True longitude
    let L = M + (1.916 * Math.sin(deg2rad(M))) 
             + (0.020 * Math.sin(deg2rad(2 * M))) 
             + 282.634;
    L = (L + 360) % 360;

    // Right ascension
    let RA = Math.atan(0.91764 * Math.tan(deg2rad(L)));
    RA = RA * 180 / Math.PI;
    RA = (RA + 360) % 360;

    // Align quadrant
    const LQ = Math.floor(L / 90) * 90;
    const RAQ = Math.floor(RA / 90) * 90;
    RA += (LQ - RAQ);
    RA /= 15;

    // Declination
    const sinDec = 0.39782 * Math.sin(deg2rad(L));
    const cosDec = Math.cos(Math.asin(sinDec));

    // Zenith ~ 90.8333°, cos ~ -0.01454
    const cosZenith = Math.cos(deg2rad(90.8333));
    const cosH = (cosZenith - (sinDec * Math.sin(deg2rad(lat))))
                 / (cosDec * Math.cos(deg2rad(lat)));

    if (cosH < -1 || cosH > 1) return NaN; // no sunrise or sunset

    let H = 0;
    if (isSunrise) {
      H = 360 - (Math.acos(cosH) * 180 / Math.PI);
    } else {
      H = (Math.acos(cosH) * 180 / Math.PI);
    }
    H /= 15;

    const T = H + RA - (0.06571 * t) - 6.622;
    let UT = (T - lngHour) % 24;
    if (UT < 0) UT += 24;
    return UT;
  }

  // Returns sunrise & sunset as UTC Date objects
  function calcSunTimesUTC(lat, lng, date) {
    const dayOfYear = getDayOfYearUTC(date);
    const sunriseUTC = calcSunTimeUTC(dayOfYear, lat, lng, true);
    const sunsetUTC = calcSunTimeUTC(dayOfYear, lat, lng, false);

    if (isNaN(sunriseUTC) || isNaN(sunsetUTC)) {
      return { sunrise: null, sunset: null };
    }

    const sunriseDateUTC = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      Math.floor(sunriseUTC),
      Math.floor((sunriseUTC % 1) * 60)
    ));
    const sunsetDateUTC = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      Math.floor(sunsetUTC),
      Math.floor((sunsetUTC % 1) * 60)
    ));

    return { sunrise: sunriseDateUTC, sunset: sunsetDateUTC };
}

function getLocalSunriseSunset(year, month, day, cityName) {
  const cityInfo = getCityInfo(cityName);
  const lat = cityInfo.latitude.degrees + cityInfo.latitude.minutes/60;
  const lon = cityInfo.longitude.degrees + cityInfo.longitude.minutes/60;
  // NOAA expects East negative, West positive
  const longitude = lon * (cityInfo.longitude.direction==='E'? 1:-1);
  const latitude  = lat * (cityInfo.latitude.direction==='N'? 1:-1);

  const dateUTC = new Date(Date.UTC(year, month-1, day));
  const { sunrise: srUTC, sunset: ssUTC } = calcSunTimesUTC(latitude, longitude, dateUTC);

  // Format directly in local time
  const opts = { timeZone: cityInfo.timezoneName, hour12: false, hour: '2-digit', minute: '2-digit' };
  const srStr = srUTC.toLocaleTimeString('en-GB', opts);
  const ssStr = ssUTC.toLocaleTimeString('en-GB', opts);

  // Parse back into numbers for comparisons
  const [srH, srM] = srStr.split(':').map(Number);
  const [ssH, ssM] = ssStr.split(':').map(Number);

  return {
    sunriseStr: srStr,
    sunsetStr:  ssStr,
    sunriseMinutes: srH*60 + srM,
    sunsetMinutes:  ssH*60 + ssM
  };
}



function determineVedicWeekdayLocal(birthH, birthM, sunriseMin, sunsetMin, weekdayIndex) {
  const weekdaysTamil = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி'];
  const birthMin = birthH*60 + birthM;

  let idx = weekdayIndex;
  let period;
  if (birthMin < sunriseMin) {
    idx = (idx + 6) % 7; // previous day
    period = 'இரவு';
  } else if (birthMin < sunsetMin) {
    period = 'பகல்';
  } else {
    period = 'இரவு';
  }
  return `${weekdaysTamil[idx]} ${period}`;
}

