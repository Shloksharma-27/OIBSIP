// ThermoSync Temperature Converter Engine
document.addEventListener('DOMContentLoaded', () => {
  const tempInput = document.getElementById('temp-input');
  const clearBtn = document.getElementById('clear-input');
  const unitRadios = document.querySelectorAll('input[name="source-unit"]');
  const convertBtn = document.getElementById('convert-btn');
  const errorMsg = document.getElementById('input-error');
  const alertBox = document.getElementById('absolute-zero-alert');

  const resCelsius = document.getElementById('res-celsius');
  const resFahrenheit = document.getElementById('res-fahrenheit');
  const resKelvin = document.getElementById('res-kelvin');

  const formulaCelsius = document.getElementById('formula-celsius');
  const formulaFahrenheit = document.getElementById('formula-fahrenheit');
  const formulaKelvin = document.getElementById('formula-kelvin');

  const mercuryFill = document.getElementById('mercury-fill');
  const indicatorStatus = document.getElementById('indicator-status');
  const presetButtons = document.querySelectorAll('.preset-btn');

  function getSelectedUnit() {
    for (const radio of unitRadios) {
      if (radio.checked) return radio.value;
    }
    return 'C';
  }

  function convertTemperatures() {
    const rawVal = tempInput.value.trim();

    // Input Validation
    if (rawVal === '') {
      errorMsg.textContent = 'Please enter a valid numeric temperature value.';
      clearOutputs();
      return;
    }

    const val = parseFloat(rawVal);
    if (isNaN(val)) {
      errorMsg.textContent = 'Invalid input: Please enter numerical values only.';
      clearOutputs();
      return;
    }

    errorMsg.textContent = '';
    const unit = getSelectedUnit();

    let cVal, fVal, kVal;
    let isSubAbsoluteZero = false;

    // Convert from selected unit to base Celsius
    if (unit === 'C') {
      cVal = val;
      fVal = (val * 9) / 5 + 32;
      kVal = val + 273.15;
      
      formulaCelsius.textContent = 'Original Value';
      formulaFahrenheit.textContent = `(${val} × 9/5) + 32`;
      formulaKelvin.textContent = `${val} + 273.15`;

      if (cVal < -273.15) isSubAbsoluteZero = true;

    } else if (unit === 'F') {
      cVal = ((val - 32) * 5) / 9;
      fVal = val;
      kVal = ((val - 32) * 5) / 9 + 273.15;

      formulaCelsius.textContent = `(${val} - 32) × 5/9`;
      formulaFahrenheit.textContent = 'Original Value';
      formulaKelvin.textContent = `((${val} - 32) × 5/9) + 273.15`;

      if (fVal < -459.67) isSubAbsoluteZero = true;

    } else if (unit === 'K') {
      cVal = val - 273.15;
      fVal = ((val - 273.15) * 9) / 5 + 32;
      kVal = val;

      formulaCelsius.textContent = `${val} - 273.15`;
      formulaFahrenheit.textContent = `((${val} - 273.15) × 9/5) + 32`;
      formulaKelvin.textContent = 'Original Value';

      if (kVal < 0) isSubAbsoluteZero = true;
    }

    // Update Output Cards
    resCelsius.textContent = formatNumber(cVal);
    resFahrenheit.textContent = formatNumber(fVal);
    resKelvin.textContent = formatNumber(kVal);

    // Absolute Zero Warning
    if (isSubAbsoluteZero) {
      alertBox.classList.add('visible');
    } else {
      alertBox.classList.remove('visible');
    }

    // Update Visual Thermometer Gauge
    updateThermometer(cVal);
  }

  function formatNumber(num) {
    if (Math.abs(num) >= 1000000 || (Math.abs(num) < 0.001 && num !== 0)) {
      return num.toExponential(3);
    }
    return Number(num.toFixed(2)).toString();
  }

  function updateThermometer(celsius) {
    // Map -50C to 100C into 0% to 100% height
    let percent = ((celsius + 50) / 150) * 100;
    percent = Math.max(5, Math.min(100, percent));
    mercuryFill.style.height = `${percent}%`;

    // Status label & color
    if (celsius <= -20) {
      indicatorStatus.textContent = 'Freezing Cold';
      indicatorStatus.style.color = '#60a5fa';
      indicatorStatus.style.background = 'rgba(59, 130, 246, 0.15)';
    } else if (celsius <= 10) {
      indicatorStatus.textContent = 'Cold';
      indicatorStatus.style.color = '#38bdf8';
      indicatorStatus.style.background = 'rgba(56, 189, 248, 0.15)';
    } else if (celsius <= 28) {
      indicatorStatus.textContent = 'Comfortable / Moderate';
      indicatorStatus.style.color = '#34d399';
      indicatorStatus.style.background = 'rgba(52, 211, 153, 0.15)';
    } else if (celsius <= 45) {
      indicatorStatus.textContent = 'Hot';
      indicatorStatus.style.color = '#fbbf24';
      indicatorStatus.style.background = 'rgba(251, 191, 36, 0.15)';
    } else {
      indicatorStatus.textContent = 'Extreme Heat';
      indicatorStatus.style.color = '#f87171';
      indicatorStatus.style.background = 'rgba(248, 113, 113, 0.15)';
    }
  }

  function clearOutputs() {
    resCelsius.textContent = '--';
    resFahrenheit.textContent = '--';
    resKelvin.textContent = '--';
    alertBox.classList.remove('visible');
  }

  // Event Listeners
  tempInput.addEventListener('input', convertTemperatures);
  convertBtn.addEventListener('click', convertTemperatures);

  unitRadios.forEach(radio => {
    radio.addEventListener('change', convertTemperatures);
  });

  clearBtn.addEventListener('click', () => {
    tempInput.value = '';
    tempInput.focus();
    clearOutputs();
    errorMsg.textContent = '';
  });

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      const unit = btn.dataset.unit;
      tempInput.value = val;
      
      const targetRadio = document.querySelector(`input[name="source-unit"][value="${unit}"]`);
      if (targetRadio) targetRadio.checked = true;

      convertTemperatures();
    });
  });

  // Initial calculation on page load
  convertTemperatures();
});
