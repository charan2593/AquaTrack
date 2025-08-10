// Angular-style Progressive Web App for AquaFlow
// Water Purifier Service Management System

interface User {
  id: number;
  username: string;
}

interface AuthService {
  currentUser: User | null;
  isLoading: boolean;
  login(credentials: {username: string, password: string}): Promise<User>;
  register(credentials: {username: string, password: string}): Promise<User>;
  logout(): Promise<void>;
  checkAuthStatus(): Promise<void>;
}

class AngularStyleAuthService implements AuthService {
  currentUser: User | null = null;
  isLoading: boolean = true;

  async checkAuthStatus(): Promise<void> {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        this.currentUser = await response.json();
      }
    } catch (error) {
      this.currentUser = null;
    } finally {
      this.isLoading = false;
      this.renderApp();
    }
  }

  async login(credentials: {username: string, password: string}): Promise<User> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    this.currentUser = await response.json();
    this.renderApp();
    return this.currentUser!;
  }

  async register(credentials: {username: string, password: string}): Promise<User> {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    this.currentUser = await response.json();
    this.renderApp();
    return this.currentUser!;
  }

  async logout(): Promise<void> {
    await fetch('/api/logout', { method: 'POST' });
    this.currentUser = null;
    this.renderApp();
  }

  private renderApp(): void {
    const appContainer = document.getElementById('root');
    if (!appContainer) return;

    if (this.isLoading) {
      appContainer.innerHTML = this.loadingTemplate();
      return;
    }

    if (this.currentUser) {
      appContainer.innerHTML = this.dashboardTemplate();
      this.attachEventListeners();
    } else {
      appContainer.innerHTML = this.authTemplate();
      this.attachAuthListeners();
    }
  }

  private loadingTemplate(): string {
    return `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading AquaFlow...</p>
      </div>
    `;
  }

  private authTemplate(): string {
    return `
      <div class="auth-container">
        <div class="auth-content">
          <div class="auth-form">
            <div class="auth-card">
              <div class="auth-header">
                <h1>AquaFlow</h1>
                <p>Water Purifier Service Management</p>
              </div>
              
              <div class="auth-tabs">
                <button class="tab-button active" data-tab="login">Login</button>
                <button class="tab-button" data-tab="register">Register</button>
              </div>
              
              <div class="tab-content">
                <form id="loginForm" class="auth-form-content active">
                  <div class="form-field">
                    <label>Username</label>
                    <input type="text" name="username" required>
                  </div>
                  
                  <div class="form-field">
                    <label>Password</label>
                    <input type="password" name="password" required>
                  </div>
                  
                  <button type="submit" class="submit-btn">Login</button>
                </form>
                
                <form id="registerForm" class="auth-form-content">
                  <div class="form-field">
                    <label>Username</label>
                    <input type="text" name="username" required>
                  </div>
                  
                  <div class="form-field">
                    <label>Password</label>
                    <input type="password" name="password" required>
                  </div>
                  
                  <button type="submit" class="submit-btn">Register</button>
                </form>
              </div>
            </div>
          </div>
          
          <div class="hero-section">
            <h2>Streamline Your Water Purifier Business</h2>
            <div class="feature-list">
              <div class="feature">
                <h3>🏠 Customer Management</h3>
                <p>Keep track of all your customers and their service history</p>
              </div>
              <div class="feature">
                <h3>🔧 Service Scheduling</h3>
                <p>Manage daily services and maintenance appointments</p>
              </div>
              <div class="feature">
                <h3>💰 Payment Tracking</h3>
                <p>Monitor rent dues and payment collections</p>
              </div>
              <div class="feature">
                <h3>📦 Inventory Control</h3>
                <p>Track stock levels and manage supplies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private dashboardTemplate(): string {
    return `
      <div class="app-container">
        <nav class="sidebar">
          <div class="sidebar-header">
            <h2>AquaFlow</h2>
            <p>Service Management</p>
          </div>
          
          <ul class="nav-list">
            <li><a href="#dashboard" class="nav-link active" data-page="dashboard">
              <span class="icon">📊</span> Dashboard
            </a></li>
            <li><a href="#customers" class="nav-link" data-page="customers">
              <span class="icon">👥</span> Customers
            </a></li>
            <li><a href="#services" class="nav-link" data-page="services">
              <span class="icon">🔧</span> Today's Services
            </a></li>
            <li><a href="#rent-dues" class="nav-link" data-page="rent-dues">
              <span class="icon">💰</span> Rent Dues
            </a></li>
            <li><a href="#purchases" class="nav-link" data-page="purchases">
              <span class="icon">🛒</span> Purchases
            </a></li>
            <li><a href="#inventory" class="nav-link" data-page="inventory">
              <span class="icon">📦</span> Inventory
            </a></li>
          </ul>
        </nav>
        
        <main class="main-content">
          <header class="app-header">
            <div class="header-spacer"></div>
            <div class="user-actions">
              <span>Welcome, ${this.currentUser?.username}</span>
              <button id="logoutBtn" class="logout-btn">Logout</button>
            </div>
          </header>
          
          <div class="page-content">
            ${this.getDashboardContent()}
          </div>
        </main>
      </div>
    `;
  }

  private getDashboardContent(): string {
    return `
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Dashboard</h1>
          <p>Water Purifier Service Management Overview</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon customers">👥</span>
              <h3>Total Customers</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">1,247</div>
              <div class="stat-change positive">+12% from last month</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon services">🔧</span>
              <h3>Today's Services</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">23</div>
              <div class="stat-change">8 completed, 15 pending</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon dues">💰</span>
              <h3>Pending Dues</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">₹45,230</div>
              <div class="stat-change">23 customers</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <span class="stat-icon revenue">💹</span>
              <h3>Monthly Revenue</h3>
            </div>
            <div class="stat-content">
              <div class="stat-value">₹1,23,450</div>
              <div class="stat-change positive">+8% from last month</div>
            </div>
          </div>
        </div>

        <div class="actions-grid">
          <div class="action-card">
            <div class="action-header">
              <span class="action-icon">👥</span>
              <h3>Customer Management</h3>
            </div>
            <div class="action-content">
              <p>Manage customer database, profiles, and service history</p>
              <button class="action-btn">View Customers</button>
            </div>
          </div>

          <div class="action-card">
            <div class="action-header">
              <span class="action-icon">🔧</span>
              <h3>Today's Services</h3>
            </div>
            <div class="action-content">
              <p>View and manage today's scheduled maintenance and services</p>
              <button class="action-btn">View Services</button>
            </div>
          </div>

          <div class="action-card">
            <div class="action-header">
              <span class="action-icon">💰</span>
              <h3>Rent Dues</h3>
            </div>
            <div class="action-content">
              <p>Track pending payments and manage collection activities</p>
              <button class="action-btn">View Dues</button>
            </div>
          </div>

          <div class="action-card">
            <div class="action-header">
              <span class="action-icon">🛒</span>
              <h3>Purifier Purchases</h3>
            </div>
            <div class="action-content">
              <p>Manage new purifier sales and installation orders</p>
              <button class="action-btn">View Purchases</button>
            </div>
          </div>

          <div class="action-card">
            <div class="action-header">
              <span class="action-icon">📦</span>
              <h3>Inventory Management</h3>
            </div>
            <div class="action-content">
              <p>Track stock levels for filters, motors, and other supplies</p>
              <button class="action-btn">View Inventory</button>
            </div>
          </div>

          <div class="action-card">
            <div class="action-header">
              <span class="action-icon">⚙️</span>
              <h3>AMC Services</h3>
            </div>
            <div class="action-content">
              <p>Annual Maintenance Contract management and scheduling</p>
              <button class="action-btn">View AMC</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachAuthListeners(): void {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const forms = document.querySelectorAll('.auth-form-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const tabName = target.dataset.tab;
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));
        
        target.classList.add('active');
        document.getElementById(tabName + 'Form')?.classList.add('active');
      });
    });

    // Login form
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    loginForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      try {
        await this.login({
          username: formData.get('username') as string,
          password: formData.get('password') as string
        });
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      }
    });

    // Register form
    const registerForm = document.getElementById('registerForm') as HTMLFormElement;
    registerForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      try {
        await this.register({
          username: formData.get('username') as string,
          password: formData.get('password') as string
        });
      } catch (error) {
        alert('Registration failed. Username might already exist.');
      }
    });
  }

  private attachEventListeners(): void {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', () => {
      this.logout();
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const page = target.dataset.page;
        
        navLinks.forEach(nav => nav.classList.remove('active'));
        target.classList.add('active');
        
        // Update page content based on selected page
        this.updatePageContent(page || 'dashboard');
      });
    });
  }

  private updatePageContent(page: string): void {
    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    const pages: Record<string, string> = {
      dashboard: this.getDashboardContent(),
      customers: '<div class="page-container"><h1>Customer Management</h1><div class="card"><p>Customer management functionality will be implemented here.</p></div></div>',
      services: '<div class="page-container"><h1>Today\'s Services</h1><div class="card"><p>Service scheduling and tracking functionality will be implemented here.</p></div></div>',
      'rent-dues': '<div class="page-container"><h1>Rent Dues</h1><div class="card"><p>Payment tracking and collection functionality will be implemented here.</p></div></div>',
      purchases: '<div class="page-container"><h1>Purchases</h1><div class="card"><p>Purchase management functionality will be implemented here.</p></div></div>',
      inventory: '<div class="page-container"><h1>Inventory Management</h1><div class="card"><p>Stock and inventory tracking functionality will be implemented here.</p></div></div>'
    };

    pageContent.innerHTML = pages[page] || pages.dashboard;
  }
}

// Initialize the application
const authService = new AngularStyleAuthService();

// Load styles and start app
document.addEventListener('DOMContentLoaded', () => {
  authService.checkAuthStatus();
});