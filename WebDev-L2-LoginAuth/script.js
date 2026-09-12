// VaultAuth UI & Interaction Script
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in and redirect to dashboard
  VaultAuth.redirectIfAuthenticated();

  // Elements
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const alertBanner = document.getElementById('auth-alert');

  const gotoRegister = document.getElementById('goto-register');
  const gotoLogin = document.getElementById('goto-login');

  const regPassword = document.getElementById('reg-password');
  const meterFill = document.getElementById('meter-fill');
  const meterLabel = document.getElementById('meter-label');
  const reqLen = document.getElementById('req-len');
  const reqNum = document.getElementById('req-num');
  const reqCase = document.getElementById('req-case');

  // Handle URL params (e.g. redirect warnings)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('redirect') === 'unauthorized') {
    showAlert('⚠️ Access Denied: Please sign in with valid credentials to view the protected dashboard.', 'error');
  } else if (urlParams.get('logged_out') === '1') {
    showAlert('✓ You have been successfully signed out.', 'success');
  }

  // Tab Switching
  function switchTab(tab) {
    clearAlert();
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    }
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));
  gotoRegister.addEventListener('click', () => switchTab('register'));
  gotoLogin.addEventListener('click', () => switchTab('login'));

  // Show/Hide Password Toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.textContent = isPass ? '🙈' : '👁️';
      }
    });
  });

  // Password Complexity Validation & Meter
  regPassword.addEventListener('input', () => {
    const val = regPassword.value;
    let score = 0;

    const hasLen = val.length >= 8;
    const hasNum = /[0-9]/.test(val);
    const hasUpper = /[A-Z]/.test(val);

    // Update Requirement Checkmarks
    updateReq(reqLen, hasLen, 'Minimum 8 characters');
    updateReq(reqNum, hasNum, 'At least 1 number (0-9)');
    updateReq(reqCase, hasUpper, 'At least 1 uppercase letter');

    if (hasLen) score += 33;
    if (hasNum) score += 33;
    if (hasUpper) score += 34;

    meterFill.style.width = `${score}%`;

    if (score === 0) {
      meterFill.style.backgroundColor = 'transparent';
      meterLabel.textContent = 'Password Strength: Empty';
    } else if (score < 66) {
      meterFill.style.backgroundColor = '#f43f5e';
      meterLabel.textContent = 'Password Strength: Weak';
    } else if (score < 100) {
      meterFill.style.backgroundColor = '#f59e0b';
      meterLabel.textContent = 'Password Strength: Moderate';
    } else {
      meterFill.style.backgroundColor = '#10b981';
      meterLabel.textContent = 'Password Strength: Strong & Secure';
    }
  });

  function updateReq(el, isValid, text) {
    if (isValid) {
      el.className = 'valid';
      el.textContent = `✓ ${text}`;
    } else {
      el.className = '';
      el.textContent = `✗ ${text}`;
    }
  }

  // Registration Form Submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const fullName = document.getElementById('reg-fullname').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    // Strict Validations
    if (!fullName || !username || !email || !password) {
      showAlert('All fields are mandatory. Please fill in required details.', 'error');
      return;
    }

    if (password.length < 8) {
      showAlert('Password must contain at least 8 characters.', 'error');
      return;
    }

    if (!/[0-9]/.test(password)) {
      showAlert('Password must contain at least one numeric digit.', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      showAlert('Password and confirmation password do not match.', 'error');
      return;
    }

    const submitBtn = document.getElementById('btn-register-submit');
    submitBtn.disabled = true;

    try {
      const result = await VaultAuth.registerUser({ fullName, username, email, password });
      if (result.success) {
        showAlert('✓ Registration successful! You can now log in.', 'success');
        registerForm.reset();
        setTimeout(() => {
          switchTab('login');
          document.getElementById('login-identifier').value = username;
          document.getElementById('login-password').focus();
        }, 1200);
      } else {
        showAlert(result.message, 'error');
      }
    } catch (err) {
      showAlert('An unexpected cryptographic error occurred. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  // Login Form Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    if (!identifier || !password) {
      showAlert('Please enter your username/email and password.', 'error');
      return;
    }

    const submitBtn = document.getElementById('btn-login-submit');
    submitBtn.disabled = true;

    try {
      const result = await VaultAuth.authenticate({ identifier, password });
      if (result.success) {
        showAlert('✓ Authentication successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } else {
        showAlert(result.message, 'error');
      }
    } catch (err) {
      showAlert('Authentication request failed. Please check your credentials.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showAlert(msg, type) {
    alertBanner.textContent = msg;
    alertBanner.className = `alert-banner ${type}`;
  }

  function clearAlert() {
    alertBanner.textContent = '';
    alertBanner.className = 'alert-banner';
  }
});
