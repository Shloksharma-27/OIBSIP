// VaultAuth - Cryptographic Authentication & Session Manager
const VaultAuth = {
  USERS_KEY: 'vaultauth_registered_users',
  SESSION_KEY: 'vaultauth_active_session',

  // SHA-256 Cryptographic Hash via Web Crypto API (No plain-text password storage)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  getUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      console.error('Error fetching users from storage', e);
      return [];
    }
  },

  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to storage', e);
    }
  },

  async registerUser({ fullName, username, email, password }) {
    const users = this.getUsers();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Check Duplicate Username or Email
    const existingUser = users.find(
      u => u.username.toLowerCase() === normalizedUsername || u.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      if (existingUser.username.toLowerCase() === normalizedUsername) {
        return { success: false, message: 'Username is already registered. Please choose another.' };
      }
      if (existingUser.email.toLowerCase() === normalizedEmail) {
        return { success: false, message: 'Email address is already in use. Try signing in instead.' };
      }
    }

    // Hash Password
    const passwordHash = await this.hashPassword(password);

    const newUser = {
      id: 'usr_' + Date.now(),
      fullName: fullName.trim(),
      username: username.trim(),
      email: email.trim(),
      passwordHash: passwordHash,
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Account successfully created! You can now log in.' };
  },

  async authenticate({ identifier, password }) {
    const users = this.getUsers();
    const normalizedId = identifier.trim().toLowerCase();
    const passwordHash = await this.hashPassword(password);

    // Find user by username OR email
    const user = users.find(
      u => (u.username.toLowerCase() === normalizedId || u.email.toLowerCase() === normalizedId) &&
           u.passwordHash === passwordHash
    );

    if (!user) {
      // Intentional generic error message to prevent account enumeration
      return { success: false, message: 'Invalid username/email or password.' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);

    // Create session token
    const session = {
      token: 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        registeredAt: user.registeredAt,
        lastLogin: user.lastLogin
      },
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  },

  getCurrentSession() {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      console.error('Error checking active session', e);
      return null;
    }
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  // Route protection guard for dashboard
  requireAuth() {
    const session = this.getCurrentSession();
    if (!session) {
      window.location.href = 'index.html?redirect=unauthorized';
      return null;
    }
    return session.user;
  },

  // Route guard for login/register (redirect if already logged in)
  redirectIfAuthenticated() {
    const session = this.getCurrentSession();
    if (session) {
      window.location.href = 'dashboard.html';
    }
  }
};
