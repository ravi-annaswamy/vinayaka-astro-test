// panchanga.js

const AstroConsts = {
  THITHI_LENGTH: 12,
  YOGA_LENGTH: 13.3333333,
  KARANA_LENGTH: 6,
  MILLIS_IN_HR: 3600000,
  PAN_APPROXIMATION: 0.01
};

function getMoonSunDiff(sun, moon) {
  let diff = moon >= sun ? moon - sun : (moon + 360) - sun;
  if (diff > 180) diff -= 180;
  return diff;
}

const THITHI_NAMES = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dvadashi",
  "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
];

function findThithi(sun, moon, diffSpeed, timeZone) {
  const diff = getMoonSunDiff(sun, moon);
  const thithiIndex = Math.floor(diff / AstroConsts.THITHI_LENGTH);
  const bal = AstroConsts.THITHI_LENGTH - (diff % AstroConsts.THITHI_LENGTH);
  const endTime = (bal / diffSpeed) + timeZone;

  return { name: THITHI_NAMES[thithiIndex], endTime };
}

const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti"
];

function findYoga(sun, moon, totalSpeed, timeZone) {
  const pos = (sun + moon) % 360;
  const yogaIndex = Math.floor(pos / AstroConsts.YOGA_LENGTH);
  const bal = AstroConsts.YOGA_LENGTH - (pos % AstroConsts.YOGA_LENGTH);
  const endTime = (bal / totalSpeed) + timeZone;

  return { name: YOGA_NAMES[yogaIndex], endTime };
}

const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija",
  "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

function calcKarana(sun, moon, diffSpeed, thithiEnd, timeZone) {
  const position = getMoonSunDiff(sun, moon);
  const karanaIndex = Math.floor((position % AstroConsts.THITHI_LENGTH) / AstroConsts.KARANA_LENGTH);
  const firstBal = AstroConsts.KARANA_LENGTH - (position % AstroConsts.KARANA_LENGTH);
  const firstEndTime = firstBal / diffSpeed + timeZone;

  const secondKaranaIndex = (karanaIndex + 1) % KARANA_NAMES.length;

  return {
    firstKarana: { name: KARANA_NAMES[karanaIndex], endTime: firstEndTime },
    secondKarana: { name: KARANA_NAMES[secondKaranaIndex], endTime: thithiEnd }
  };
}

function calcPaksha(sun, moon) {
  return (moon >= sun && moon - sun < 180) ? "Shukla Paksha" : "Krishna Paksha";
}

// panchanga.js

function calculatePanchanga(sunPosition, moonPosition, sunSpeed, moonSpeed, adjustedTimeZone) {
  const totalSpeed = sunSpeed + moonSpeed;
  const diffSpeed = moonSpeed - sunSpeed;

  const thithi = findThithi(sunPosition, moonPosition, diffSpeed, adjustedTimeZone);
  const yoga = findYoga(sunPosition, moonPosition, totalSpeed, adjustedTimeZone);
  const karana = calcKarana(sunPosition, moonPosition, diffSpeed, thithi.endTime, adjustedTimeZone);
  const paksha = calcPaksha(sunPosition, moonPosition);
  const nakshatraInfo = calculateNakshatraPada(moonPosition);

  return {
    thithi,
    yoga,
    karana,
    paksha,
    nakshatraInfo
  };
}

function displayPanchang(thithi, yoga, karana, paksha, nakshatraInfo) {
  document.getElementById('panchangInfo').innerHTML = `
    <h3>பஞ்சாங்கம்</h3>
    <p><b>திதி:</b> ${thithi.name} (முடிவு: ${thithi.endTime.toFixed(2)} hrs)</p>
    <p><b>யோகம்:</b> ${yoga.name} (முடிவு: ${yoga.endTime.toFixed(2)} hrs)</p>
    <p><b>கரணம் 1:</b> ${karana.firstKarana.name} (முடிவு: ${karana.firstKarana.endTime.toFixed(2)} hrs)</p>
    <p><b>கரணம் 2:</b> ${karana.secondKarana.name} (முடிவு: ${karana.secondKarana.endTime.toFixed(2)} hrs)</p>
    <p><b>பக்ஷம்:</b> ${paksha}</p>
    <p><b>நட்சத்திரம்:</b> ${nakshatraInfo.nakshatra} (${nakshatraInfo.pada} பாதம்)</p>
  `;
}

