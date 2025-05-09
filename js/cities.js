/**
 * Returns city info (latitude, longitude, timezone) for known cityName.
 * If not found, returns null.
 */
function getCityInfo(cityName) {
  const cityData = {
    'Chennai': {
      latitude: { degrees: 13, minutes: 5, direction: 'N' },
      longitude: { degrees: 80, minutes: 17, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Vellore': {
      latitude: { degrees: 12, minutes: 56, direction: 'N' },
      longitude: { degrees: 79, minutes: 8, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Salem': {
      latitude: { degrees: 11, minutes: 40, direction: 'N' },
      longitude: { degrees: 78, minutes: 9, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Coimbatore': {
      latitude: { degrees: 11, minutes: 0, direction: 'N' },
      longitude: { degrees: 76, minutes: 57, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Krishnagiri': {
      latitude: { degrees: 12, minutes: 31, direction: 'N' },
      longitude: { degrees: 78, minutes: 12, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Tirunelveli': {
      latitude: { degrees: 8, minutes: 44, direction: 'N' },
      longitude: { degrees: 77, minutes: 41, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Kanyakumari': {
      latitude: { degrees: 8, minutes: 5, direction: 'N' },
      longitude: { degrees: 77, minutes: 32, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Tiruchirappalli': {
      latitude: { degrees: 10, minutes: 49, direction: 'N' },
      longitude: { degrees: 78, minutes: 40, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Madurai': {
      latitude: { degrees: 9, minutes: 55, direction: 'N' },
      longitude: { degrees: 78, minutes: 7, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Hyderabad': {
      latitude: { degrees: 17, minutes: 23, direction: 'N' },
      longitude: { degrees: 78, minutes: 27, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Bengaluru': {
      latitude: { degrees: 12, minutes: 58, direction: 'N' },
      longitude: { degrees: 77, minutes: 36, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'Thiruvananthapuram': {
      latitude: { degrees: 8, minutes: 29, direction: 'N' },
      longitude: { degrees: 76, minutes: 57, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'New Delhi': {
      latitude: { degrees: 28, minutes: 38, direction: 'N' },
      longitude: { degrees: 77, minutes: 13, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'New York, NY': {
      latitude: { degrees: 40, minutes: 43, direction: 'N' },
      longitude: { degrees: 74, minutes: 0, direction: 'W' },
      timezone: { hours: 5, minutes: 0, direction: 'W' },
      timezoneName: 'America/New_York',
      dst: true
    },
    'Westlake, OH': {
      latitude: { degrees: 41, minutes: 27, direction: 'N' },
      longitude: { degrees: 81, minutes: 55, direction: 'W' },
      timezone: { hours: 5, minutes: 0, direction: 'W' },
      timezoneName: 'America/New_York',
      dst: true
    },
    'San Francisco, CA': {
      latitude: { degrees: 37, minutes: 46, direction: 'N' },
      longitude: { degrees: 122, minutes: 25, direction: 'W' },
      timezone: { hours: 8, minutes: 0, direction: 'W' },
      timezoneName: 'America/Los_Angeles',
      dst: true
    },
    'Mumbai': {
      latitude: { degrees: 19, minutes: 4, direction: 'N' },
      longitude: { degrees: 72, minutes: 52, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    },
    'London': {
      latitude: { degrees: 51, minutes: 30, direction: 'N' },
      longitude: { degrees: 0, minutes: 7, direction: 'W' },
      timezone: { hours: 0, minutes: 0, direction: 'W' },
      timezoneName: 'Europe/London',
      dst: true
    },
    'Chicago, IL': {
      latitude: { degrees: 41, minutes: 52, direction: 'N' },
      longitude: { degrees: 87, minutes: 38, direction: 'W' },
      timezone: { hours: 6, minutes: 0, direction: 'W' },
      timezoneName: 'America/Chicago',
      dst: true
    },
    'Houston, TX': {
      latitude: { degrees: 29, minutes: 45, direction: 'N' },
      longitude: { degrees: 95, minutes: 22, direction: 'W' },
      timezone: { hours: 6, minutes: 0, direction: 'W' },
      timezoneName: 'America/Chicago',
      dst: true
    },
    'Phoenix, AZ': {
      latitude: { degrees: 33, minutes: 27, direction: 'N' },
      longitude: { degrees: 112, minutes: 4, direction: 'W' },
      timezone: { hours: 7, minutes: 0, direction: 'W' },
      timezoneName: 'America/Phoenix',
      dst: false
    },
    'Kolkata': {
      latitude: { degrees: 22, minutes: 34, direction: 'N' },
      longitude: { degrees: 88, minutes: 22, direction: 'E' },
      timezone: { hours: 5, minutes: 30, direction: 'E' },
      timezoneName: 'Asia/Kolkata',
      dst: false
    }
  };

  return cityData[cityName] || null;
}

const cityTamilNames = {
  'Chennai': 'சென்னை',
  'Tiruchirappalli': 'திருச்சிராப்பள்ளி',
  'Madurai': 'மதுரை',
  'Vellore': 'வேலூர்',
  'Salem': 'சேலம்',
  'Coimbatore': 'கோயம்புத்தூர்',
  'Krishnagiri': 'கிருஷ்ணகிரி',
  'Tirunelveli': 'திருநெல்வேலி',
  'Kanyakumari': 'கன்னியாகுமரி',
  'Hyderabad': 'ஹைதராபாத்',
  'Bengaluru': 'பெங்களூரு',
  'Thiruvananthapuram': 'திருவனந்தபுரம்',
  'New Delhi': 'புதுதில்லி',
  'Mumbai': 'மும்பை',
  'Kolkata': 'கொல்கத்தா',
  'London': 'லண்டன்',
  'New York, NY': 'நியூயார்க்',
  'Westlake, OH': 'வெஸ்ட்லேக்',
  'San Francisco, CA': 'சான் பிரான்சிஸ்கோ',
  'Chicago, IL': 'சிகாகோ',
  'Houston, TX': 'ஹூஸ்டன்',
  'Phoenix, AZ': 'பீனிக்ஸ்'
};


/**
 * Adjusts timezone if city observes Daylight Saving Time.
 * Returns corrected timezone object.
 */
function getCurrentTimezone(cityInfo, cityName, date = new Date()) {
  if (!cityInfo.dst) {
    return cityInfo.timezone;
  }

  const year = date.getFullYear();
  let isDST = false;

  if (cityName.includes('London')) {
    const lastSundayMarch = getLastSundayOfMonth(year, 2); // March
    const lastSundayOctober = getLastSundayOfMonth(year, 9); // October
    isDST = (date >= lastSundayMarch && date < lastSundayOctober);
  } else {
    const secondSundayMarch = getNthSundayOfMonth(year, 2, 3); // March
    const firstSundayNovember = getNthSundayOfMonth(year, 1, 11); // November
    isDST = (date >= secondSundayMarch && date < firstSundayNovember);
  }

  if (isDST) {
    const offsetSign = cityInfo.timezone.direction === 'E' ? 1 : -1;
    const standardMinutes = offsetSign * (cityInfo.timezone.hours * 60 + cityInfo.timezone.minutes);
    const dstMinutes = standardMinutes + 60; 
    const adjustedSign = dstMinutes >= 0 ? 'E' : 'W';

    return { 
      hours: Math.floor(Math.abs(dstMinutes) / 60), 
      minutes: Math.abs(dstMinutes) % 60, 
      direction: adjustedSign 
    };
  } else {
    return cityInfo.timezone;
  }
}


function getLastSundayOfMonth(year, month) {
  const lastDay = new Date(year, month + 1, 0);
  const dayOfWeek = lastDay.getDay();
  return new Date(year, month, lastDay.getDate() - dayOfWeek);
}

function getNthSundayOfMonth(year, nth, month) {
  let date = new Date(year, month - 1, 1);
  let sundayCount = 0;

  while (true) {
    if (date.getDay() === 0) {
      sundayCount++;
      if (sundayCount === nth) {
        return date;
      }
    }
    date.setDate(date.getDate() + 1);
  }
}
