import { Routes } from '@angular/router';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { StartPage } from './pages/start-page/start-page';
import { AuthPage } from './pages/auth/auth';
import { DashboardPage, DocumentsPage, AddDocumentPage, ProfilePage, SoutenancesPage, CampaignsPage } from './pages/candidat';
import { AdminDashboard } from './pages/admin/admin-dashboard';
import { AdminCampagnesComponent } from './pages/admin/admin-campagnes/admin-campagnes';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users';
import { ProfileSelectionPage } from './pages/profile-selection/profile-selection';
import { SoutenancePremiumPage } from './pages/soutenance/soutenance-premium';
import { EncadrantDashboardPremiumPage } from './pages/encadrant/encadrant-dashboard-premium';

export const routes: Routes = [
  { path: '', component: StartPage },
  { path: 'auth', component: AuthPage },
  { path: 'reset-password', loadComponent: () => import('./pages/auth/reset-password').then(m => m.ResetPasswordPage) },
  { path: 'confirm', loadComponent: () => import('./pages/confirm/confirm').then(m => m.ConfirmEmailPage) },
  { path: 'profile-selection', component: ProfileSelectionPage },
  { path: 'admin', component: AdminDashboard },
  { path: 'admin/campagnes', component: AdminCampagnesComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'soutenance', component: SoutenancePremiumPage },
  // Public campaigns listing (accessible without authentication)
  { path: 'campaigns', loadComponent: () => import('./pages/start-page/campaigns/campaigns').then(m => m.CampaignsPage) },
  { path: 'campaigns/:id', loadComponent: () => import('./pages/start-page/campaign-detail/campaign-detail').then(m => m.CampaignDetailComponent) },
  // About page
  { path: 'about', loadComponent: () => import('./pages/about/about-page').then(m => m.AboutPage) },
  // Contact page
  { path: 'contact', loadComponent: () => import('./pages/contact/contact-page').then(m => m.ContactPage) },
  
  // Candidat-specific routes
  { path: 'candidat/dashboard', component: DashboardPage },
  { path: 'candidat/documents', component: DocumentsPage },
  { path: 'candidat/documents/add', component: AddDocumentPage },
  { path: 'candidat/profile', component: ProfilePage },
  { path: 'candidat/favorites', loadComponent: () => import('./pages/candidat/favorites/favorites').then(m => m.FavoritesPage) },
  { path: 'candidat/applications', loadComponent: () => import('./pages/candidat/applications/applications').then(m => m.ApplicationsPage) },
  { path: 'candidat/soutenances', component: SoutenancesPage },
  { path: 'candidat/campaigns', component: CampaignsPage },
  
  // Encadrant-specific routes
  { path: 'encadrant/dashboard', component: EncadrantDashboardPremiumPage },
  { path: 'encadrant/profile', loadComponent: () => import('./pages/encadrant/profile/profile').then(m => m.EncadrantProfileComponent) },
  
  // Legacy redirects for backward compatibility
  { path: 'dashboard', redirectTo: 'candidat/dashboard', pathMatch: 'full' },
  { path: 'documents', redirectTo: 'candidat/documents', pathMatch: 'full' },
  { path: 'documents/add', redirectTo: 'candidat/documents/add', pathMatch: 'full' },
  { path: 'profile', redirectTo: 'candidat/profile', pathMatch: 'full' },
  
  { path: '**', redirectTo: '' }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes, withInMemoryScrolling({
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  }))
];
