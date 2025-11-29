import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../components/navbar/public-navbar';
import { UserNavbarComponent } from '../../components/navbar/user-navbar';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbarComponent, UserNavbarComponent],
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.css']
})
export class AboutPage {
  constructor(public auth: AuthService, protected tx: TranslationService) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn ? this.auth.isLoggedIn() : false;
  }
}
