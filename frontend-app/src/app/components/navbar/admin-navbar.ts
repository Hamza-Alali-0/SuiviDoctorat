import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <button class="menu-btn" aria-label="Toggle sidebar" (click)="toggleSidebar()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="brand">
          <div class="brand-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L3 9v8c0 7.732 5.076 13 13 13s13-5.268 13-13V9L16 3z" fill="currentColor" opacity="0.15"/>
              <path d="M16 3L3 9v8c0 7.732 5.076 13 13 13s13-5.268 13-13V9L16 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 11v7m0 3h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="brand-text">Admin Dashboard</span>
        </div>
      </div>

      <div class="nav-center">
        <div class="search-container">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input type="search" placeholder="Search..." aria-label="Search" class="search-input" />
        </div>
      </div>

      <div class="nav-right">
        <button class="icon-button" title="Toggle theme" aria-label="Toggle dark mode" (click)="toggleTheme()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button class="icon-button" title="Change language" aria-label="Language selector" (click)="changeLanguage()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <button class="profile-button" title="Profile" aria-label="User profile" (click)="toggleProfileMenu()">
          <img *ngIf="profileImage" [src]="profileImage" alt="User profile" class="profile-image" (error)="profileImage = null" />
          <div *ngIf="!profileImage" class="profile-initials">{{ userInitials }}</div>
        </button>

        <div class="profile-dropdown" *ngIf="showProfileMenu" (click)="closeProfileMenu()">
          <div class="dropdown-overlay" (click)="closeProfileMenu()"></div>
          <div class="dropdown-content" (click)="$event.stopPropagation()">
            <a routerLink="/admin" class="dropdown-item" (click)="closeProfileMenu()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Gérer les utilisateurs
            </a>
            <a routerLink="/admin/campagnes" class="dropdown-item" (click)="closeProfileMenu()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Gérer les campagnes
            </a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" (click)="logout()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Panel -->
    <div class="sidebar-container" [class.show]="showSidebar">
      <div class="sidebar-overlay" (click)="closeSidebar()"></div>
      <div class="sidebar" (click)="$event.stopPropagation()">
        <!-- Sidebar Header -->
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <div class="sidebar-brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 3L3 9v8c0 7.732 5.076 13 13 13s13-5.268 13-13V9L16 3z" fill="currentColor" opacity="0.15"/>
                <path d="M16 3L3 9v8c0 7.732 5.076 13 13 13s13-5.268 13-13V9L16 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 11v7m0 3h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="sidebar-brand-text">Admin Panel</span>
          </div>
          <button class="sidebar-close" (click)="closeSidebar()" aria-label="Close sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Navigation Items -->
        <nav class="sidebar-nav">
          <a 
            *ngFor="let item of navItems" 
            [routerLink]="item.path" 
            routerLinkActive="active"
            class="nav-item"
            (click)="closeSidebar()">
            <svg class="nav-item-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" [innerHTML]="getNavIcon(item.icon)"></svg>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-avatar">
              <img 
                *ngIf="profileImage"
                [src]="profileImage" 
                alt="User profile"
                (error)="profileImage = null" />
              <div *ngIf="!profileImage" class="sidebar-avatar-initials">{{ userInitials }}</div>
            </div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-email">Admin</div>
            </div>
            <button class="sidebar-settings-btn" [routerLink]="['/admin/settings']" (click)="closeSidebar()" aria-label="Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M19.78 4.22l-4.24 4.24m-7.08 7.08l-4.24 4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <button class="logout-btn" (click)="logout()" aria-label="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --navbar-height:64px; --color-primary:#1e40af; --color-bg:#ffffff; --color-border:#e5e7eb; --color-text:#111827; --color-text-secondary:#6b7280; --color-hover:#f3f4f6; --color-active:#e5e7eb; --shadow:0 1px 3px 0 rgba(0,0,0,0.1); --transition:all 0.2s ease; display:block }
    .navbar{ position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; gap:1.5rem; height:var(--navbar-height); padding:0 1.5rem; background:var(--color-bg); border-bottom:1px solid var(--color-border); box-shadow:var(--shadow) }
    .nav-left{ display:flex; align-items:center; gap:1rem; flex-shrink:0 }
    .menu-btn{ display:flex; align-items:center; justify-content:center; width:40px; height:40px; padding:0; border:none; background:transparent; color:var(--color-text); border-radius:8px; cursor:pointer; transition:var(--transition) }
    .menu-btn:hover{ background:var(--color-hover) }
    .menu-btn:active{ background:var(--color-active) }
    .brand{ display:flex; align-items:center; gap:0.625rem; user-select:none }
    .brand-icon{ display:flex; align-items:center; justify-content:center; width:32px; height:32px; color:var(--color-primary) }
    .brand-text{ font-size:1.125rem; font-weight:600; color:var(--color-text); letter-spacing:-0.01em }
    .nav-center{ flex:1; display:flex; justify-content:center; max-width:600px; margin:0 auto }
    .search-container{ position:relative; width:100%; max-width:500px; display:flex; align-items:center; gap:0.75rem; padding:0 1rem; background:var(--color-hover); border:1px solid var(--color-border); border-radius:24px; transition:all 0.2s }
    .search-container:focus-within{ background:var(--color-bg); border-color:var(--color-primary); box-shadow:0 0 0 3px rgba(30,64,175,0.1) }
    .search-icon{ flex-shrink:0; color:var(--color-text-secondary); transition:all 0.2s }
    .search-container:focus-within .search-icon{ color:var(--color-primary) }
    .search-input{ flex:1; height:40px; padding:0; border:none; background:transparent; color:var(--color-text); font-size:0.9375rem; outline:none }
    .search-input::placeholder{ color:var(--color-text-secondary) }
    .nav-right{ display:flex; align-items:center; gap:0.5rem; flex-shrink:0 }
    .icon-button{ display:flex; align-items:center; justify-content:center; width:40px; height:40px; padding:0; border:none; background:transparent; color:var(--color-text); border-radius:50%; cursor:pointer; transition:all 0.2s }
    .icon-button:hover{ background:var(--color-hover) }
    .profile-button{ display:flex; align-items:center; justify-content:center; width:36px; height:36px; padding:0; border:2px solid var(--color-border); background:var(--color-hover); border-radius:50%; cursor:pointer; overflow:hidden; transition:all 0.2s }
    .profile-button:hover{ border-color:var(--color-primary); transform:scale(1.05) }
    .profile-image{ width:100%; height:100%; object-fit:cover; display:block }
    .profile-initials{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.875rem; font-weight:600; color:#fff; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); user-select:none }
    .profile-dropdown{ position:fixed; top:0; left:0; right:0; bottom:0; z-index:100 }
    .dropdown-overlay{ position:absolute; top:0; left:0; right:0; bottom:0; background:transparent }
    .dropdown-content{ position:absolute; top:70px; right:1.5rem; width:220px; background:var(--color-bg); border:1px solid var(--color-border); border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.15); overflow:hidden; animation:dropdown-appear 0.2s ease }
    @keyframes dropdown-appear{ from{ opacity:0; transform:translateY(-8px) } to{ opacity:1; transform:translateY(0) } }
    .dropdown-item{ display:flex; align-items:center; gap:0.75rem; width:100%; padding:0.875rem 1.25rem; border:none; background:transparent; color:var(--color-text); font-size:0.9375rem; text-align:left; text-decoration:none; cursor:pointer; transition:all 0.2s }
    .dropdown-item svg{ flex-shrink:0; color:var(--color-text-secondary) }
    .dropdown-item:hover{ background:var(--color-hover) }
    .dropdown-item:hover svg{ color:var(--color-primary) }
    .dropdown-divider{ height:1px; background:var(--color-border); margin:0 }
    
    /* Sidebar Styles */
    .sidebar-container{ position:fixed; top:0; left:0; right:0; bottom:0; z-index:100; pointer-events:none }
    .sidebar-container.show{ pointer-events:auto }
    .sidebar-overlay{ position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.4); opacity:0; transition:opacity 0.3s ease; pointer-events:none }
    .sidebar-container.show .sidebar-overlay{ opacity:1; pointer-events:auto }
    .sidebar{ position:absolute; top:0; left:0; bottom:0; width:280px; background:var(--color-bg); border-right:1px solid var(--color-border); box-shadow:4px 0 12px rgba(0,0,0,0.1); transform:translateX(-100%); transition:transform 0.3s ease; display:flex; flex-direction:column; overflow:hidden }
    .sidebar-container.show .sidebar{ transform:translateX(0) }
    .sidebar-header{ display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem; border-bottom:1px solid var(--color-border); background:var(--color-bg) }
    .sidebar-brand{ display:flex; align-items:center; gap:0.75rem }
    .sidebar-brand-icon{ display:flex; align-items:center; justify-content:center; width:36px; height:36px; color:var(--color-primary) }
    .sidebar-brand-text{ font-size:1.125rem; font-weight:600; color:var(--color-text); letter-spacing:-0.01em }
    .sidebar-close{ display:flex; align-items:center; justify-content:center; width:36px; height:36px; padding:0; border:none; background:transparent; color:var(--color-text); border-radius:8px; cursor:pointer; transition:var(--transition) }
    .sidebar-close:hover{ background:var(--color-hover) }
    .sidebar-nav{ flex:1; padding:1rem 0; overflow-y:auto }
    .nav-item{ display:flex; align-items:center; gap:1rem; padding:0.875rem 1.5rem; color:var(--color-text); font-size:0.9375rem; font-weight:500; text-decoration:none; transition:var(--transition); border-left:3px solid transparent; cursor:pointer }
    .nav-item:hover{ background:var(--color-hover); border-left-color:var(--color-primary) }
    .nav-item.active{ background:var(--color-hover); border-left-color:var(--color-primary); color:var(--color-primary) }
    .nav-item-icon{ flex-shrink:0; color:var(--color-text-secondary); transition:var(--transition) }
    .nav-item:hover .nav-item-icon,.nav-item.active .nav-item-icon{ color:var(--color-primary) }
    .sidebar-footer{ padding:1rem 1.5rem; border-top:1px solid var(--color-border); background:var(--color-bg); display:flex; flex-direction:column; gap:0.75rem }
    .sidebar-user{ display:flex; align-items:center; gap:0.75rem; padding:0.75rem; background:var(--color-hover); border-radius:8px; position:relative }
    .sidebar-avatar{ width:40px; height:40px; border-radius:50%; overflow:hidden; flex-shrink:0; border:2px solid var(--color-border) }
    .sidebar-avatar img{ width:100%; height:100%; object-fit:cover; display:block }
    .sidebar-avatar-initials{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.875rem; font-weight:600; color:#fff; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%) }
    .sidebar-user-info{ flex:1; min-width:0 }
    .sidebar-user-email{ font-size:0.875rem; font-weight:500; color:var(--color-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis }
    .sidebar-settings-btn{ display:flex; align-items:center; justify-content:center; width:32px; height:32px; padding:0; border:none; background:transparent; color:var(--color-text-secondary); border-radius:6px; cursor:pointer; transition:var(--transition); flex-shrink:0 }
    .sidebar-settings-btn:hover{ background:var(--color-bg); color:var(--color-primary) }
    .sidebar-settings-btn:active{ transform:scale(0.95) }
    .logout-btn{ display:flex; align-items:center; justify-content:center; gap:0.75rem; width:100%; padding:0.875rem 1rem; border:1px solid var(--color-border); background:transparent; color:var(--color-text); font-size:0.9375rem; font-weight:500; border-radius:8px; cursor:pointer; transition:var(--transition) }
    .logout-btn:hover{ background:#fee2e2; border-color:#ef4444; color:#dc2626 }
    .logout-btn:active{ transform:scale(0.98) }
    .logout-btn svg{ flex-shrink:0; transition:var(--transition) }
    .logout-btn:hover svg{ transform:translateX(2px) }
    
    @media (max-width:768px){ .navbar{ padding:0 1rem; gap:1rem } .brand-text{ display:none } .nav-center{ max-width:none } .sidebar{ width:260px } }
  `]
})
export class AdminNavbarComponent implements OnInit {
  profileImage: string | null = null;
  userInitials = 'A';
  showProfileMenu = false;
  showSidebar = false;

  navItems = [
    { path: '/admin', icon: 'home', label: 'Tableau de bord' },
    { path: '/admin/campagnes', icon: 'calendar', label: 'Gérer les campagnes' },
    { path: '/admin/users', icon: 'users', label: 'Gérer les utilisateurs' },
    { path: '/admin/dossiers', icon: 'folder', label: 'Dossiers d\'inscription' },
    { path: '/admin/reports', icon: 'chart', label: 'Rapports' },
    { path: '/admin/settings', icon: 'settings', label: 'Paramètres' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    try {
      this.auth.getProfile().subscribe({
        next: (profile: any) => {
          this.profileImage = profile?.avatar || null;
          const name = profile?.firstName || profile?.name || '';
          const email = profile?.email || '';
          this.userInitials = name ? name.substring(0, 2).toUpperCase() : (email ? email.substring(0, 2).toUpperCase() : 'A');
        },
        error: () => { this.profileImage = null; }
      });
    } catch (e) {}
  }

  toggleTheme() {
    try {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    } catch (e) {}
  }

  changeLanguage() {
    try {
      const lang = localStorage.getItem('lang') || 'fr';
      const newLang = lang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('lang', newLang);
      console.log('[AdminNavbar] Language:', newLang);
    } catch (e) {}
  }

  toggleProfileMenu() { 
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) {
      this.showSidebar = false;
    }
  }
  
  closeProfileMenu() { this.showProfileMenu = false; }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar) {
      this.showProfileMenu = false;
    }
  }

  closeSidebar() {
    this.showSidebar = false;
  }

  logout() {
    this.auth.logout();
    this.closeProfileMenu();
    this.closeSidebar();
    this.router.navigate(['/auth']);
  }

  getNavIcon(icon: string): string {
    const icons: Record<string, string> = {
      home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/>',
      calendar: '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" fill="none"/>',
      folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" fill="none"/>',
      chart: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" fill="none"/>',
      settings: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v6m0 6v6M1 12h6m6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M19.78 4.22l-4.24 4.24m-7.08 7.08l-4.24 4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    };
    return icons[icon] || '';
  }
}
