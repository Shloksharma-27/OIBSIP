// OmniCalc Pro - Robust Arithmetic & Chaining Logic
document.addEventListener('DOMContentLoaded', () => {
  const displayCurrent = document.getElementById('display-current');
  const displayHistory = document.getElementById('display-history');
  const calcGrid = document.getElementById('calc-grid');
  const historyToggle = document.getElementById('history-toggle');
  const historyDrawer = document.getElementById('history-drawer');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');

  let currentOperand = '0';
  let previousOperand = '';
  let operation = undefined;
  let shouldResetScreen = false;
  let calculationHistory = [];

  // Safe arithmetic computation function (Zero eval() usage)
  function compute(prev, curr, op) {
    const a = parseFloat(prev);
    const b = parseFloat(curr);
    if (isNaN(a) || isNaN(b)) return '';

    let result = 0;
    switch (op) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '×':
      case '*':
        result = a * b;
        break;
      case '÷':
      case '/':
        if (b === 0) {
          return 'Error: Division by 0';
        }
        result = a / b;
        break;
      default:
        return '';
    }

    // Limit floating point inaccuracies
    return Math.round(result * 100000000) / 100000000;
  }

  function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
      currentOperand = number;
      shouldResetScreen = false;
    } else {
      currentOperand += number;
    }
    updateDisplay();
  }

  function appendDecimal() {
    if (shouldResetScreen) {
      currentOperand = '0.';
      shouldResetScreen = false;
      updateDisplay();
      return;
    }
    if (!currentOperand.includes('.')) {
      currentOperand += '.';
      updateDisplay();
    }
  }

  function chooseOperation(op) {
    if (currentOperand.includes('Error')) {
      clearAll();
    }

    // If chaining operations (e.g. 5 + 3, then press *)
    if (previousOperand !== '' && operation !== undefined && !shouldResetScreen) {
      const result = compute(previousOperand, currentOperand, operation);
      if (typeof result === 'string' && result.startsWith('Error')) {
        currentOperand = result;
        previousOperand = '';
        operation = undefined;
        updateDisplay();
        return;
      }
      previousOperand = result.toString();
      currentOperand = result.toString();
    } else {
      previousOperand = currentOperand;
    }

    operation = op;
    shouldResetScreen = true;
    updateDisplay();
  }

  function evaluate() {
    if (operation === undefined || shouldResetScreen || previousOperand === '') {
      return;
    }

    const prev = previousOperand;
    const curr = currentOperand;
    const op = operation;

    const result = compute(prev, curr, op);

    if (typeof result === 'string' && result.startsWith('Error')) {
      currentOperand = result;
      displayHistory.textContent = `${prev} ${op} ${curr} =`;
      previousOperand = '';
      operation = undefined;
      shouldResetScreen = true;
      updateDisplay();
      return;
    }

    const formattedRes = result.toString();
    const historyItem = {
      expression: `${prev} ${op} ${curr}`,
      result: formattedRes
    };

    calculationHistory.unshift(historyItem);
    renderHistory();

    displayHistory.textContent = `${prev} ${op} ${curr} =`;
    currentOperand = formattedRes;
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
  }

  function deleteLastDigit() {
    if (shouldResetScreen || currentOperand.includes('Error')) {
      clearAll();
      return;
    }
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    displayHistory.textContent = '';
    updateDisplay();
  }

  function toggleSign() {
    if (currentOperand === '0' || currentOperand.includes('Error')) return;
    if (currentOperand.startsWith('-')) {
      currentOperand = currentOperand.substring(1);
    } else {
      currentOperand = '-' + currentOperand;
    }
    updateDisplay();
  }

  function applyPercentage() {
    if (currentOperand.includes('Error')) return;
    const val = parseFloat(currentOperand);
    if (!isNaN(val)) {
      currentOperand = (val / 100).toString();
      updateDisplay();
    }
  }

  function updateDisplay() {
    displayCurrent.textContent = currentOperand;
    if (operation !== undefined) {
      displayHistory.textContent = `${previousOperand} ${operation}`;
    }
  }

  function renderHistory() {
    if (calculationHistory.length === 0) {
      historyList.innerHTML = '<div class="empty-history">No computations recorded yet.</div>';
      return;
    }

    historyList.innerHTML = calculationHistory.map((item, idx) => `
      <div class="history-item" data-index="${idx}">
        <div class="hist-expr">${item.expression} =</div>
        <div class="hist-res">${item.result}</div>
      </div>
    `).join('');

    // Click on history item to recall result
    historyList.querySelectorAll('.history-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const idx = itemEl.dataset.index;
        currentOperand = calculationHistory[idx].result;
        shouldResetScreen = false;
        updateDisplay();
        historyDrawer.classList.remove('open');
      });
    });
  }

  // Button Click Delegation
  calcGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.dataset.action;
    const value = btn.dataset.value;

    switch (action) {
      case 'number':
        appendNumber(value);
        break;
      case 'decimal':
        appendDecimal();
        break;
      case 'operator':
        chooseOperation(value);
        break;
      case 'calculate':
        evaluate();
        break;
      case 'delete':
        deleteLastDigit();
        break;
      case 'all-clear':
        clearAll();
        break;
      case 'negate':
        toggleSign();
        break;
      case 'percent':
        applyPercentage();
        break;
    }
  });

  // History Drawer Controls
  historyToggle.addEventListener('click', () => {
    historyDrawer.classList.toggle('open');
  });

  clearHistoryBtn.addEventListener('click', () => {
    calculationHistory = [];
    renderHistory();
  });

  // Physical Keyboard Support
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      appendNumber(e.key);
      highlightKey(e.key);
    } else if (e.key === '.') {
      appendDecimal();
      highlightKey('.');
    } else if (e.key === '+' || e.key === '-') {
      chooseOperation(e.key);
      highlightKey(e.key);
    } else if (e.key === '*') {
      chooseOperation('×');
      highlightKey('×');
    } else if (e.key === '/') {
      e.preventDefault();
      chooseOperation('÷');
      highlightKey('÷');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      evaluate();
      highlightAction('calculate');
    } else if (e.key === 'Backspace') {
      deleteLastDigit();
      highlightAction('delete');
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      clearAll();
      highlightAction('all-clear');
    } else if (e.key === '%') {
      applyPercentage();
      highlightAction('percent');
    }
  });

  function highlightKey(val) {
    const btn = document.querySelector(`button[data-value="${val}"]`);
    if (btn) triggerKeyAnimation(btn);
  }

  function highlightAction(act) {
    const btn = document.querySelector(`button[data-action="${act}"]`);
    if (btn) triggerKeyAnimation(btn);
  }

  function triggerKeyAnimation(btn) {
    btn.classList.add('active-key');
    setTimeout(() => btn.classList.remove('active-key'), 150);
  }
});
