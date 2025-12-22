import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../components/navbar/admin-navbar';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard {
  currentDate = new Date();
  
  stats = signal({
    totalUsers: 124,
    pendingRequests: 12,
    activeCampaigns: 3,
    totalTheses: 45
  });

  recentActivity = signal([
    {
      id: 1,
      type: 'user',
      message: '<strong>Sophie Martin</strong> a demandé le rôle de <strong>Doctorant</strong>',
      time: 'Il y a 2 heures'
    },
    {
      id: 2,
      type: 'campaign',
      message: 'Nouvelle campagne <strong>Inscriptions 2024</strong> créée',
      time: 'Il y a 5 heures'
    },
    {
      id: 3,
      type: 'doc',
      message: '<strong>Jean Dupont</strong> a soumis sa thèse',
      time: 'Il y a 1 jour'
    },
    {
      id: 4,
      type: 'user',
      message: '<strong>Dr. Alice Bernard</strong> a rejoint comme Encadrant',
      time: 'Il y a 2 jours'
    }
  ]);
}
