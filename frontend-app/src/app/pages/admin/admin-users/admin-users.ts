import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminNavbarComponent } from '../../../components/navbar/admin-navbar';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: string;
}

interface RoleRequest {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  requestedRole: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  justification?: string;
  createdAt: string;
}

@Component({
  selector: 'admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './admin-users.html',
  styles: [`
    .wrap { max-width:1400px; margin:0 auto; padding:2rem; display:flex; gap:2rem; }
    .sidebar { width:280px; flex-shrink:0; }
    .main-content { flex:1; min-width:0; }
    
    /* Filters */
    .filter-card { background:#fff; border-radius:16px; padding:1.5rem; border:1px solid #e4e4e7; position:sticky; top:100px; }
    .filter-title { font-weight:600; font-size:1rem; color:#18181b; margin-bottom:1.25rem; }
    .filter-group { margin-bottom:1.5rem; }
    .filter-label { font-size:0.75rem; font-weight:600; color:#71717a; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em; }
    .filter-option { display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.75rem; border-radius:8px; cursor:pointer; transition:all 0.2s; color:#52525b; font-size:0.875rem; }
    .filter-option:hover { background:#f4f4f5; color:#18181b; }
    .filter-option.active { background:#eff6ff; color:#1d4ed8; font-weight:500; }
    .filter-option input { accent-color:#2563eb; }

    /* Header */
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; }
    .page-title { font-size:1.5rem; font-weight:700; color:#18181b; margin:0 0 0.25rem; }
    .page-subtitle { color:#71717a; font-size:0.9rem; }
    
    /* Tabs */
    .tabs { display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid #e4e4e7; padding-bottom:1px; }
    .tab-btn { padding:0.75rem 1.25rem; background:none; border:none; border-bottom:2px solid transparent; font-size:0.9rem; font-weight:500; color:#71717a; cursor:pointer; transition:all 0.2s; }
    .tab-btn:hover { color:#18181b; }
    .tab-btn.active { color:#2563eb; border-bottom-color:#2563eb; }
    .tab-badge { background:#f4f4f5; color:#52525b; padding:0.1rem 0.4rem; border-radius:99px; font-size:0.75rem; margin-left:0.5rem; }
    .tab-btn.active .tab-badge { background:#eff6ff; color:#1d4ed8; }

    /* Search */
    .search-bar { margin-bottom:1.5rem; }
    .search-input { width:100%; padding:0.75rem 1rem; border-radius:12px; border:1px solid #e4e4e7; font-size:0.9rem; transition:all 0.2s; }
    .search-input:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }

    /* Users Grid */
    .users-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1rem; }
    .user-card { background:#fff; border:1px solid #e4e4e7; border-radius:12px; padding:1.25rem; transition:all 0.2s; display:flex; flex-direction:column; gap:1rem; }
    .user-card:hover { border-color:#d4d4d8; box-shadow:0 4px 12px rgba(0,0,0,0.05); transform:translateY(-2px); }
    
    .user-header { display:flex; align-items:center; gap:1rem; }
    .user-avatar { width:48px; height:48px; border-radius:10px; background:#f4f4f5; color:#52525b; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:1.1rem; }
    .user-info { flex:1; min-width:0; }
    .user-name { font-weight:600; color:#18181b; font-size:0.95rem; margin-bottom:0.1rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .user-email { color:#71717a; font-size:0.8rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    
    .user-meta { display:flex; gap:0.5rem; flex-wrap:wrap; }
    .role-badge { padding:0.25rem 0.6rem; border-radius:6px; font-size:0.7rem; font-weight:600; text-transform:uppercase; letter-spacing:0.02em; }
    .role-admin { background:#f4f4f5; color:#18181b; }
    .role-encadrant { background:#eff6ff; color:#1d4ed8; }
    .role-doctorant { background:#f0fdf4; color:#15803d; }
    .role-candidat { background:#fff7ed; color:#c2410c; }
    
    .user-actions { margin-top:auto; padding-top:1rem; border-top:1px solid #f4f4f5; display:flex; gap:0.5rem; }
    .action-btn { flex:1; padding:0.5rem; border-radius:6px; border:1px solid #e4e4e7; background:#fff; color:#52525b; font-size:0.8rem; font-weight:500; cursor:pointer; transition:all 0.2s; }
    .action-btn:hover { background:#f4f4f5; color:#18181b; }
    .action-btn.primary { background:#18181b; color:#fff; border-color:#18181b; }
    .action-btn.primary:hover { background:#27272a; }

    /* Requests List */
    .requests-list { display:flex; flex-direction:column; gap:1rem; }
    .req-card { background:#fff; border:1px solid #e4e4e7; border-radius:12px; padding:1.25rem; display:flex; gap:1.5rem; align-items:flex-start; transition:all 0.2s; }
    .req-card:hover { border-color:#d4d4d8; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    
    .req-avatar { width:56px; height:56px; border-radius:12px; background:#eff6ff; color:#1d4ed8; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:1.25rem; flex-shrink:0; }
    .req-content { flex:1; }
    .req-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem; }
    .req-name { font-weight:600; color:#18181b; font-size:1rem; }
    .req-email { color:#71717a; font-size:0.85rem; }
    .req-date { font-size:0.75rem; color:#a1a1aa; }
    
    .req-details { background:#f4f4f5; padding:0.75rem; border-radius:8px; margin-bottom:1rem; }
    .req-label { font-size:0.75rem; color:#71717a; font-weight:500; margin-bottom:0.25rem; }
    .req-value { font-size:0.9rem; color:#18181b; font-weight:500; }
    
    .req-actions { display:flex; gap:0.75rem; }
    .btn-approve { padding:0.5rem 1rem; background:#16a34a; color:#fff; border:none; border-radius:6px; font-size:0.85rem; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:0.4rem; }
    .btn-reject { padding:0.5rem 1rem; background:#fff; color:#dc2626; border:1px solid #fecaca; border-radius:6px; font-size:0.85rem; font-weight:500; cursor:pointer; }
    .btn-approve:hover { background:#15803d; }
    .btn-reject:hover { background:#fee2e2; }

    /* Empty State */
    .empty-state { text-align:center; padding:4rem 2rem; color:#71717a; }
    .empty-icon { width:48px; height:48px; margin-bottom:1rem; color:#d4d4d8; }
  `]
})
export class AdminUsersComponent implements OnInit {
  view = signal<'users' | 'requests'>('users');
  users = signal<User[]>([]);
  requests = signal<RoleRequest[]>([]);
  loading = signal(false);
  
  // Filters
  searchQuery = signal('');
  selectedRole = signal('all');
  selectedStatus = signal('all');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    // Mock data - replace with API
    setTimeout(() => {
      this.users.set([
        { id: 1, firstName: 'Admin', lastName: 'System', email: 'admin@univ.edu', role: 'ADMIN', status: 'ACTIVE', createdAt: '2024-01-01' },
        { id: 2, firstName: 'Prof', lastName: 'Encadrant', email: 'prof@univ.edu', role: 'ENCADRANT', status: 'ACTIVE', createdAt: '2024-02-15' },
        { id: 3, firstName: 'Etudiant', lastName: 'Chercheur', email: 'student@univ.edu', role: 'DOCTORANT', status: 'ACTIVE', createdAt: '2024-03-10' },
      ]);

      this.requests.set([
        { id: 101, userId: 4, firstName: 'Nouveau', lastName: 'Professeur', email: 'new.prof@univ.edu', requestedRole: 'ENCADRANT', status: 'PENDING', createdAt: '2024-12-20' },
        { id: 102, userId: 5, firstName: 'Candidat', lastName: 'Doctorant', email: 'candidate@univ.edu', requestedRole: 'DOCTORANT', status: 'PENDING', createdAt: '2024-12-21' }
      ]);
      
      this.loading.set(false);
    }, 600);
  }

  get filteredUsers() {
    return this.users().filter(u => {
      const matchesSearch = (u.firstName + ' ' + u.lastName + u.email).toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesRole = this.selectedRole() === 'all' || u.role === this.selectedRole();
      return matchesSearch && matchesRole;
    });
  }

  get filteredRequests() {
    return this.requests().filter(r => {
      const matchesSearch = (r.firstName + ' ' + r.lastName + r.email).toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesStatus = this.selectedStatus() === 'all' || r.status === this.selectedStatus();
      return matchesSearch && matchesStatus;
    });
  }

  getInitials(first: string, last: string): string {
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }

  approveRequest(id: number) {
    // API call to approve
    this.requests.update(reqs => reqs.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  }

  rejectRequest(id: number) {
    // API call to reject
    this.requests.update(reqs => reqs.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  }
}
