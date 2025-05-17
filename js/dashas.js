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
  const dashas = [];
  for (let i = 0; i < 9; i++) {
    let mLordIndex = (natalDashaIndex + i) % 9;
    let startOffset = dlist[i * 9];
    let endOffset = (i < 8) ? dlist[(i + 1) * 9] : null;

    let subLords = [];
    let bp = mLordIndex;
    for (let j = 0; j < 9; j++) {
      let subStartOffset = dlist[i * 9 + j];
      let subEndOffset = (j < 8) ? dlist[i * 9 + j + 1] : endOffset;

      let antaraLords = [];
      let ap = bp;
      let antaraDuration = (subEndOffset - subStartOffset) / 120;

      let antaraOffset = subStartOffset;
      for (let k = 0; k < 9; k++) {
        let antaraLength = dashyr[ap] * antaraDuration;
        antaraLords.push({
          lord: dlnamtam[ap],
          startOffset: antaraOffset,
          endOffset: antaraOffset + antaraLength
        });
        antaraOffset += antaraLength;
        ap = (ap + 1) % 9;
      }

      subLords.push({
        lord: dlnamtam[bp],
        startOffset: subStartOffset,
        endOffset: subEndOffset,
        antaras: antaraLords
      });
      bp = (bp + 1) % 9;
    }

    dashas.push({
      lord: dlnamtam[mLordIndex],
      startOffset,
      endOffset,
      subLords
    });
  }
  return dashas;
}


/**
 * Generate side-by-side HTML tables for Mahadasha & Bhukti details.
 */
function makeDashaTables(dashas, birthJD, offsetNow) {
  const currDashaIdx = findCurrentDashaIndex(dashas, offsetNow);

  let dashaTable = `<h4>தசை வரிசை</h4><table><thead><tr><th>மஹாதசை</th><th>தொடக்கம்</th><th>முடிவு</th></tr></thead><tbody>`;

  dashas.forEach((dasha, i) => {
    const highlight = (i === currDashaIdx) ? ' style="background-color: #ccffcc;"' : '';
    const endDate = (dasha.endOffset !== null)
      ? jul2dateDDMMYYYY(birthJD + dasha.endOffset)
      : '—';
    dashaTable += `<tr${highlight} onclick="showBhuktis(${i})">
      <td>${dasha.lord}</td>
      <td>${jul2dateDDMMYYYY(birthJD + dasha.startOffset)}</td>
      <td>${endDate}</td>
    </tr>`;
  });

  dashaTable += `</tbody></table>`;

  // Bhukti table
  let bhuktiTable = '';
  let antaraTable = '';

  if (currDashaIdx >= 0) {
    const subs = dashas[currDashaIdx].subLords;
    const currBhuktiIdx = subs.findIndex(sub => offsetNow >= sub.startOffset && offsetNow < sub.endOffset);

    bhuktiTable = `<h4>${dashas[currDashaIdx].lord} தசை: புக்தி வரிசை</h4><table><thead><tr><th>புக்தி</th><th>தொடக்கம்</th><th>முடிவு</th></tr></thead><tbody>`;

    subs.forEach((sub, j) => {
      const highlight = (j === currBhuktiIdx) ? ' style="background-color: #ccffcc;"' : '';
      bhuktiTable += `<tr${highlight} onclick="showAntaras(${currDashaIdx}, ${j})">
        <td>${sub.lord}</td>
        <td>${jul2dateDDMMYYYY(birthJD + sub.startOffset)}</td>
        <td>${jul2dateDDMMYYYY(birthJD + sub.endOffset)}</td>
      </tr>`;
    });

    bhuktiTable += `</tbody></table>`;

    // Antara table (initial load)
    if (currBhuktiIdx >= 0) {
      const antaras = subs[currBhuktiIdx].antaras;
      const currAntaraIdx = antaras.findIndex(antara => offsetNow >= antara.startOffset && offsetNow < antara.endOffset);

      antaraTable = `<h4>${dashas[currDashaIdx].lord} - ${subs[currBhuktiIdx].lord} அந்தரம் வரிசை</h4><table><thead><tr><th>அந்தரம்</th><th>தொடக்கம்</th><th>முடிவு</th></tr></thead><tbody>`;
      
      antaras.forEach((antara, k) => {
        const highlight = (k === currAntaraIdx) ? ' style="background-color: #ccffcc;"' : '';
        antaraTable += `<tr${highlight}>
          <td>${antara.lord}</td>
          <td>${jul2dateDDMMYYYY(birthJD + antara.startOffset)}</td>
          <td>${jul2dateDDMMYYYY(birthJD + antara.endOffset)}</td>
        </tr>`;
      });
      
      antaraTable += `</tbody></table>`;
    } else {
      antaraTable = `<table><thead><tr><th colspan="3">தற்போதைய அந்தரம் ஏதுமில்லை</th></tr></thead></table>`;
    }
  } else {
    bhuktiTable = `<table><thead><tr><th colspan="3">தற்போதைய தசை ஏதுமில்லை</th></tr></thead></table>`;
    antaraTable = `<table><thead><tr><th colspan="3">தற்போதைய அந்தரம் ஏதுமில்லை</th></tr></thead></table>`;
  }

  // Return explicitly Dasha-Bhukti-Antara side-by-side
  return `
  <div class="dasha-container">
    <div class="dasha-item">${dashaTable}</div>
    <div class="dasha-item">${bhuktiTable}</div>
    <div class="dasha-item" id="antaraContainer">${antaraTable}</div>
  </div>`;
}


function showBhuktis(mahadashaIndex) {
  if (!window._storedDashas || !window._birthJD) return;

  const dashas = window._storedDashas;
  const birthJD = window._birthJD;
  const todayJD = getSystemJD();
  const offsetNow = todayJD - birthJD;

  const subs = dashas[mahadashaIndex].subLords;
  const currentDashaLord = dashas[mahadashaIndex].lord;

  // Find current Bhukti running now, if any
  let currBhukti = subs.findIndex(sub => 
    offsetNow >= sub.startOffset && offsetNow < sub.endOffset
  );

  // Highlight selected Mahadasha
  const mahaTable = document.querySelector('.dasha-container .dasha-item:first-child table');
  if (mahaTable) {
    const mahaRows = mahaTable.querySelectorAll('tbody tr');
    mahaRows.forEach((row, idx) => {
      row.style.backgroundColor = (idx === mahadashaIndex) ? '#ccffcc' : '';
    });
  }

  // Build Bhukti table with clickable rows for Antara
  let bhuktiTable = `<h4>${currentDashaLord} தசை: புக்தி வரிசை</h4>
    <table>
      <thead>
        <tr>
          <th>புக்தி</th>
          <th>தொடக்கம்</th>
          <th>முடிவு</th>
        </tr>
      </thead>
      <tbody>`;

  for (let j = 0; j < subs.length; j++) {
    const subStart = (subs[j].startOffset !== null)
      ? jul2dateDDMMYYYY(birthJD + subs[j].startOffset)
      : '---';
    const subEnd = (subs[j].endOffset !== null)
      ? jul2dateDDMMYYYY(birthJD + subs[j].endOffset)
      : '---';

    const rowStyle = (j === currBhukti || (currBhukti === -1 && j === 0)) ?
      ' style="background-color: #ccffcc;"' : '';

    bhuktiTable += `<tr${rowStyle} onclick="showAntaras(${mahadashaIndex}, ${j})">
      <td>${subs[j].lord}</td>
      <td>${subStart}</td>
      <td>${subEnd}</td>
    </tr>`;
  }

  bhuktiTable += '</tbody></table>';

  // Replace Bhukti container content
  const dashaContainer = document.querySelector('.dasha-container');
  if (dashaContainer && dashaContainer.children.length >= 2) {
    dashaContainer.children[1].innerHTML = bhuktiTable;
  }

  // Automatically show Antara for current Bhukti, or first Bhukti if none running
  const antaraDiv = document.getElementById('antaraContainer');
  if (currBhukti >= 0) {
    showAntaras(mahadashaIndex, currBhukti);
  } else if (subs.length > 0) {
    showAntaras(mahadashaIndex, 0);
  } else {
    antaraDiv.innerHTML = '';
  }
}


function showAntaras(mahadashaIndex, bhuktiIndex) {
  if (!window._storedDashas || !window._birthJD) return;

  const dashas = window._storedDashas;
  const birthJD = window._birthJD;
  const todayJD = getSystemJD();
  const offsetNow = todayJD - birthJD;

  const antaras = dashas[mahadashaIndex].subLords[bhuktiIndex].antaras;
  const currentDashaLord = dashas[mahadashaIndex].lord;
  const currentBhuktiLord = dashas[mahadashaIndex].subLords[bhuktiIndex].lord;

  // Find current Antara
  let currAntara = antaras.findIndex(antara =>
    offsetNow >= antara.startOffset && offsetNow < antara.endOffset
  );

  let antaraTable = `<h4>${currentDashaLord}/${currentBhuktiLord} : அந்தர வரிசை</h4>
    <table>
      <thead>
        <tr>
          <th>அந்தரம்</th>
          <th>தொடக்கம்</th>
          <th>முடிவு</th>
        </tr>
      </thead>
      <tbody>`;

  for (let k = 0; k < antaras.length; k++) {
    const antaraStart = jul2dateDDMMYYYY(birthJD + antaras[k].startOffset);
    const antaraEnd = jul2dateDDMMYYYY(birthJD + antaras[k].endOffset);

    const rowStyle = (k === currAntara) ? ' style="background-color: #ccffcc;"' : '';

    antaraTable += `<tr${rowStyle}>
      <td>${antaras[k].lord}</td>
      <td>${antaraStart}</td>
      <td>${antaraEnd}</td>
    </tr>`;
  }

  antaraTable += '</tbody></table>';

  const antaraDiv = document.getElementById('antaraContainer');
  if (antaraDiv) {
    antaraDiv.innerHTML = antaraTable;
  }

  // Highlight selected Bhukti
  const bhuktiRows = document.querySelectorAll('.dasha-container .dasha-item:nth-child(2) tbody tr');
  bhuktiRows.forEach((row, idx) => {
    row.style.backgroundColor = (idx === bhuktiIndex) ? '#ccffcc' : '';
  });
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
