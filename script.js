const unitData = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    metric_ton: 1000,
    pound: 0.45359237,
    ounce: 0.028349523125
  },
  area: {
    square_meter: 1,
    square_kilometer: 1000000,
    square_foot: 0.09290304,
    square_mile: 2589988.11,
    acre: 4046.85642,
    hectare: 10000
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    cubic_meter: 1000,
    gallon_us: 3.78541,
    quart_us: 0.946353,
    pint_us: 0.473176,
    cup: 0.24
  },
  speed: {
    mps: 1, // Meter per second
    kph: 0.277778, // Km per hour
    mph: 0.44704, // Miles per hour
    knot: 0.514444
  },
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2628000,
    year: 31536000
  },
  data: {
    byte: 1,
    kilobyte: 1024,
    megabyte: 1048576,
    gigabyte: 1073741824,
    terabyte: 1099511627776
  },
  energy: {
    joule: 1,
    kilojoule: 1000,
    calorie: 4.184,
    kilocalorie: 4184,
    watt_hour: 3600,
    kilowatt_hour: 3600000
  },
  pressure: {
    pascal: 1,
    kilopascal: 1000,
    bar: 100000,
    psi: 6894.76,
    atmosphere: 101325
  }
};

const unitLabels = {
  meter: "Meter (m)", kilometer: "Kilometer (km)", centimeter: "Centimeter (cm)", millimeter: "Millimeter (mm)",
  mile: "Mile (mi)", yard: "Yard (yd)", foot: "Foot (ft)", inch: "Inch (in)",
  kilogram: "Kilogram (kg)", gram: "Gram (g)", milligram: "Milligram (mg)", metric_ton: "Metric Ton (t)",
  pound: "Pound (lb)", ounce: "Ounce (oz)",
  square_meter: "Square Meter (m²)", square_kilometer: "Square Kilometer (km²)", square_foot: "Square Foot (ft²)",
  square_mile: "Square Mile (mi²)", acre: "Acre", hectare: "Hectare",
  liter: "Liter (L)", milliliter: "Milliliter (mL)", cubic_meter: "Cubic Meter (m³)", gallon_us: "Gallon (US gal)",
  quart_us: "Quart (US qt)", pint_us: "Pint (US pt)", cup: "Cup",
  mps: "Meters per sec (m/s)", kph: "Km per hour (km/h)", mph: "Miles per hour (mph)", knot: "Knot (kn)",
  second: "Second (s)", minute: "Minute (min)", hour: "Hour (h)", day: "Day (d)", week: "Week (wk)", month: "Month", year: "Year (yr)",
  byte: "Byte (B)", kilobyte: "Kilobyte (KB)", megabyte: "Megabyte (MB)", gigabyte: "Gigabyte (GB)", terabyte: "Terabyte (TB)",
  joule: "Joule (J)", kilojoule: "Kilojoule (kJ)", calorie: "Calorie (cal)", kilocalorie: "Kilocalorie (kcal)", watt_hour: "Watt-hour (Wh)", kilowatt_hour: "Kilowatt-hour (kWh)",
  pascal: "Pascal (Pa)", kilopascal: "Kilopascal (kPa)", bar: "Bar", psi: "PSI (lb/in²)", atmosphere: "Atmosphere (atm)"
};

function loadUnits() {
  const cat = document.getElementById('category').value;
  const fromSelect = document.getElementById('fromUnit');
  const toSelect = document.getElementById('toUnit');
  
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  if (cat === 'temperature') {
    const tempUnits = [
      { key: 'celsius', name: 'Celsius (°C)' },
      { key: 'fahrenheit', name: 'Fahrenheit (°F)' },
      { key: 'kelvin', name: 'Kelvin (K)' }
    ];
    tempUnits.forEach(u => {
      fromSelect.add(new Option(u.name, u.key));
      toSelect.add(new Option(u.name, u.key));
    });
    toSelect.selectedIndex = 1;
  } else {
    const units = unitData[cat];
    let keys = Object.keys(units);
    
    keys.forEach((key, index) => {
      const name = unitLabels[key] || key;
      fromSelect.add(new Option(name, key));
      toSelect.add(new Option(name, key));
    });
    if (keys.length > 1) toSelect.selectedIndex = 1;
  }

  convert();
}

function convert() {
  const cat = document.getElementById('category').value;
  const val = parseFloat(document.getElementById('inputValue').value);
  const from = document.getElementById('fromUnit').value;
  const to = document.getElementById('toUnit').value;
  
  const resultEl = document.getElementById('resultValue');
  const formulaEl = document.getElementById('formulaText');

  if (isNaN(val)) {
    resultEl.innerText = "0";
    formulaEl.innerText = "Please enter a valid number";
    return;
  }

  let res = 0;

  if (cat === 'temperature') {
    res = convertTemperature(val, from, to);
    formulaEl.innerText = getTempFormula(from, to);
  } else {
    const baseVal = val * unitData[cat][from];
    res = baseVal / unitData[cat][to];
    formulaEl.innerText = `1 ${unitLabels[from] || from} = ${(unitData[cat][from] / unitData[cat][to]).toFixed(6)} ${unitLabels[to] || to}`;
  }

  // Format output
  let formattedResult = Number.isInteger(res) ? res : parseFloat(res.toFixed(6));
  resultEl.innerText = `${formattedResult}`;
}

function convertTemperature(val, from, to) {
  if (from === to) return val;
  let tempInC = 0;

  if (from === 'celsius') tempInC = val;
  else if (from === 'fahrenheit') tempInC = (val - 32) * (5 / 9);
  else if (from === 'kelvin') tempInC = val - 273.15;

  if (to === 'celsius') return tempInC;
  if (to === 'fahrenheit') return (tempInC * 9 / 5) + 32;
  if (to === 'kelvin') return tempInC + 273.15;
}

function getTempFormula(from, to) {
  if (from === to) return "Same units selected";
  if (from === 'celsius' && to === 'fahrenheit') return "(°C × 9/5) + 32 = °F";
  if (from === 'fahrenheit' && to === 'celsius') return "(°F − 32) × 5/9 = °C";
  if (from === 'celsius' && to === 'kelvin') return "°C + 273.15 = K";
  if (from === 'kelvin' && to === 'celsius') return "K − 273.15 = °C";
  if (from === 'fahrenheit' && to === 'kelvin') return "(°F − 32) × 5/9 + 273.15 = K";
  if (from === 'kelvin' && to === 'fahrenheit') return "(K − 273.15) × 9/5 + 32 = °F";
}

function swapUnits() {
  const from = document.getElementById('fromUnit');
  const to = document.getElementById('toUnit');
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  convert();
}

function resetAll() {
  document.getElementById('inputValue').value = 1;
  document.getElementById('category').selectedIndex = 0;
  loadUnits();
}

function copyResult() {
  const resText = document.getElementById('resultValue').innerText;
  const toText = document.getElementById('toUnit').selectedOptions[0].text;
  const copyBtn = document.getElementById('copyBtn');

  navigator.clipboard.writeText(`${resText} ${toText}`).then(() => {
    copyBtn.innerText = "Copied!";
    setTimeout(() => { copyBtn.innerText = "Copy Result"; }, 2000);
  });
}

// Initialize on page load
window.onload = loadUnits;
