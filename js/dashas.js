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
                   '<th>மஹாதசை</th>' +
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

    dashaTable += '<tr' + rowStyle + ' onclick="showBhuktis(' + i + ')">' +
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

    bhuktiTable = '<h4>' + currentDashaLord + ' தசை: புக்தி வரிசை</h4>' +
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

function showBhuktis(mahadashaIndex) {
  if (!window._storedDashas || !window._birthJD) return;

  let dashas = window._storedDashas;
  let birthJD = window._birthJD;
  let todayJD = getSystemJD();
  let offsetNow = todayJD - birthJD;

  let subs = dashas[mahadashaIndex].subLords;
  let currentDashaLord = dashas[mahadashaIndex].lord;

  // Find which bhukti is running (if any) for the selected mahadasha
  let currBhukti = -1;
  for (let j = 0; j < subs.length; j++) {
    let sStart = subs[j].startOffset ?? 999999;
    let sEnd = subs[j].endOffset ?? 999999;
    if (sStart <= offsetNow && offsetNow < sEnd) {
      currBhukti = j;
      break;
    }
  }

  let bhuktiTable = '<h4>' + currentDashaLord + ' தசை: புக்தி வரிசை</h4>' +
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

  // Replace only the second column (bhukti table)
  const container = document.querySelector('.dasha-container');
  if (container && container.children.length === 2) {
    container.children[1].innerHTML = bhuktiTable;
  }

  // Highlight the clicked mahadasha row
  const mahaTable = container.children[0].querySelector('table');
  if (mahaTable) {
    const rows = mahaTable.querySelectorAll('tbody tr');
    rows.forEach((row, idx) => {
      if (idx === mahadashaIndex) {
        row.style.backgroundColor = '#ccffcc';  // Light green
      } else {
        row.style.backgroundColor = '';          // Remove background
      }
    });
  }
}



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
  window._storedDashas = dashas;
  window._birthJD = birthJD;
  let todayJD = getSystemJD();
  let offsetNow = todayJD - birthJD;
  let html = makeDashaTables(dashas, birthJD, offsetNow);
  document.getElementById('dashasContainer').innerHTML = html;
}
