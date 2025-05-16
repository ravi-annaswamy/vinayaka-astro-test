// highlighting.js
// JavaScript module for interactive planetary highlighting in South Indian Chart

// Map each Tamil sign name to its ruling planet (Tamil names)
const SIGN_LORD = {
  'மேஷம்': 'செவ்வாய்',
  'ரிஷபம்': 'சுக்கிரன்',
  'மிதுனம்': 'புதன்',
  'கடகம்': 'சந்திரன்',
  'சிம்மம்': 'சூரியன்',
  'கன்னி': 'புதன்',
  'துலாம்': 'சுக்கிரன்',
  'விருச்சிகம்': 'செவ்வாய்',
  'தனுசு': 'குரு',
  'மகரம்': 'சனி',
  'கும்பம்': 'சனி',
  'மீனம்': 'குரு'
};

// Define the “natural Karaka” for each relative house (1–12, Lagna=1)
const KARAKA_PER_HOUSE = {
  1: 'சூரியன்',
  2: 'குரு',
  3: 'செவ்வாய்',
  4: 'சந்திரன்',
  5: 'குரு',
  6: 'சனி',
  7: 'சுக்கிரன்',
  8: 'ராகு',
  9: 'சூரியன்',
  10: 'சனி',
  11: 'செவ்வாய்',
  12: 'சுக்கிரன்'
};

// Aspect offsets (houses away from the planet’s own house)
const ASPECT_OFFSETS = {
  'குரு':    [4, 6, 8],  // Jupiter aspects 5,7,9
  'சனி':    [2, 6, 9],  // Saturn aspects 3,7,10
  'செவ்வாய்':[3, 6, 7],  // Mars aspects 4,7,8
  'சூரியன்': [6],       // Sun opposite only
  'சந்திரன்': [6],       // Moon opposite only
  'புதன்':   [6],       // Mercury opposite only
  'சுக்கிரன்':[6],        // Venus opposite only
  'ராகு':     [6],      // Rahu opposite only
  'கேது':     [6]     // Ketu opposite only
};

let ownerPerHouse    = {};   // house# → owner planet
let occupantsPerHouse= {};   // house# → [planet names]
let aspectsPerHouse  = {};   // house# → [planet names]
let karakaPerHouse   = {};   // house# → karaka planet


// Global Configuration Variables (colors, transition duration, selectors)
const HIGHLIGHT_COLORS = {
  owner:    '#009999',  // brighter yellow
  karaka:   '#FF0000',  // brighter red
  occupant: '#000000',  // brighter green
  aspecting:'#666666'   // brighter blue
};
const HIGHLIGHT_TRANSITION_DURATION = 200;

const CHART_CONTAINER_ID = 'chartContainer';

// highlighting.js (Updated event listener)

// Initialization
function initHighlightingModule() {
  const chartContainer = document.getElementById(CHART_CONTAINER_ID);

  chartContainer.addEventListener('click', function(event) {
    let clickedElement = event.target;

    // Traverse up if necessary to find rect
    while (clickedElement && clickedElement.tagName !== 'rect') {
      clickedElement = clickedElement.parentNode;
    }

    if (clickedElement && clickedElement.hasAttribute('data-house')) {
      const houseNumber = parseInt(clickedElement.getAttribute('data-house'), 10);
      toggleHighlightsFor(houseNumber);
    } else {
      clearHighlights();
    }
  });

}

// Determine who rules each house
function computeOwners(planetaryPositions) {
  // 1. Find the Ascendant to get the Lagna sign index (0–11)
  const asc = planetaryPositions.find(p => p.name === 'லக்னம்');
  const lagnaIndex = Math.floor((asc.longitude % 360) / 30);

  ownerPerHouse = {};
  // 2. For each relative house 1–12, compute its zodiac sign and lord
  for (let h = 1; h <= 12; h++) {
    // actual sign index in the ecliptic
    const signIdx = (lagnaIndex + h - 1) % 12;  
    const signName = indianZodiacTamil[signIdx];
    ownerPerHouse[h] = SIGN_LORD[signName];
  }
}

// List occupants for each house
function computeOccupants(planetaryPositions) {
  occupantsPerHouse = {};
  planetaryPositions.forEach(p => {
    const h = p.houseNumber;
    occupantsPerHouse[h] = occupantsPerHouse[h] || [];
    occupantsPerHouse[h].push(p.name);
  });
}

// Determine which planets aspect each house
function computeAspects(planetaryPositions) {
  aspectsPerHouse = {};
  planetaryPositions.forEach(p => {
    const home = p.houseNumber;
    const offsets = ASPECT_OFFSETS[p.name] || [];
    offsets.forEach(offset => {
      const target = ((home + offset - 1) % 12) + 1;
      aspectsPerHouse[target] = aspectsPerHouse[target] || [];
      aspectsPerHouse[target].push(p.name);
    });
  });
}

// Assign the natural Karaka for each house
function computeKarakas() {
  karakaPerHouse = { ...KARAKA_PER_HOUSE };
}

function computeHighlightData(planetaryPositions) {
  computeOwners(planetaryPositions);
  computeOccupants(planetaryPositions);
  computeAspects(planetaryPositions);
  computeKarakas();
}


// Start the module
document.addEventListener('DOMContentLoaded', initHighlightingModule);

let activeHouse = null;

// Clear all highlights, restore default colours & show info panel
function clearHighlights() {
  document.querySelectorAll('#chartContainer svg text[data-planet]')
    .forEach(el => {
      el.style.fill = '';      // resets to default (black)
      el.style.opacity = '1';  // fully visible
    });

  // Remove the house number overlay
  const overlay = document.querySelector('#chartContainer svg text.house-number-overlay');
  if (overlay) overlay.remove();

  // Show central info panel again
  // document.getElementById('vedicInfo').style.display = '';
}

// Highlight planets for a given house (with owner>karaka>occupant>aspect priority)
function toggleHighlightsFor(houseNumber) {
  // If clicking same house twice, clear and exit
  if (activeHouse === houseNumber) {
    clearHighlights();
    activeHouse = null;
    return;
  }
  activeHouse = houseNumber;

  // Clear any existing highlights
  clearHighlights();

  // Gather categories
  const owner   = ownerPerHouse[houseNumber];
  const karaka  = karakaPerHouse[houseNumber];
  const occupants = occupantsPerHouse[houseNumber] || [];
  const aspects   = aspectsPerHouse[houseNumber]   || [];

  // Colour each planet‐text
  document.querySelectorAll('#chartContainer svg text[data-planet]')
    .forEach(el => {
      const p = el.getAttribute('data-planet');

      // 1) Always show Lagna in default black
      if (p === 'லக்னம்') {
        el.style.fill    = '';     // default fill
        el.style.opacity = '1';
        return;
      }
      // Determine category
      let category = null;
      if (p === owner)       category = 'owner';
      else if (p === karaka) category = 'karaka';
      else if (occupants.includes(p)) category = 'occupant';
      else if (aspects.includes(p))   category = 'aspecting';

      if (category) {
        // Highlight
        el.style.fill    = HIGHLIGHT_COLORS[category];
        el.style.opacity = '1';
      } else {
        // Hide unrelated
        el.style.opacity = '0';
      }
    });

  // Remove any previous overlay
  const prev = document.querySelector('#chartContainer svg text.house-number-overlay');
  if (prev) prev.remove();

  // Draw a transparent house number in the top-right of the clicked cell
  const svg = document.querySelector('#chartContainer svg');
  const rect = svg.querySelector(`rect[data-house="${houseNumber}"]`);
  if (rect) {
    const x = +rect.getAttribute('x');
    const y = +rect.getAttribute('y');
    const w = +rect.getAttribute('width');
    const h = +rect.getAttribute('height');

    const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
    txt.setAttribute('class','house-number-overlay');
    // position at top-right, with a small margin
    txt.setAttribute('x', x + w - 4);
    txt.setAttribute('y', y + 4);
    // align end of text to x, and hanging baseline at y
    txt.setAttribute('text-anchor','end');
    txt.setAttribute('dominant-baseline','hanging');
    txt.setAttribute('fill','rgba(0,0,0,0.3)');
    txt.setAttribute('font-size','16');    // slightly smaller
    txt.textContent = houseNumber;
    svg.appendChild(txt);
  }


  // 4) Hide the central info panel when any house is active
  // document.getElementById('vedicInfo').style.display = 'none';

}

/**
 * Renders the persistent house‐info table.
 */
function renderHouseInfoTable() {
  const container = document.getElementById('houseInfoPanel');
  if (!container) return;

  let html = `
    <table>
      <thead>
        <tr>
          <th>பாவகம்</th>
          <th>அதிபதி</th>
          <th>கிரகம்</th>
          <th>பார்வை</th>
          <th>காரகன்</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let h = 1; h <= 12; h++) {
    const owner     = ownerPerHouse[h]     || '-';
    const occupants = (occupantsPerHouse[h] && occupantsPerHouse[h].length)
                      ? occupantsPerHouse[h].join(', ')
                      : '-';
    const aspects   = (aspectsPerHouse[h]   && aspectsPerHouse[h].length)
                      ? aspectsPerHouse[h].join(', ')
                      : '-';
    const karaka    = karakaPerHouse[h]    || '-';

    html += `
      <tr>
        <td>${h}</td>
        <td>${owner}</td>
        <td>${occupants}</td>
        <td>${aspects}</td>
        <td>${karaka}</td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
  `;
  container.innerHTML = html;
}
