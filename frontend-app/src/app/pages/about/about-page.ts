import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicNavbarComponent } from '../../components/navbar/public-navbar';
import { UserNavbarComponent } from '../../components/navbar/user-navbar';
import { SiteFooterComponent } from '../../components/footer/site-footer.component';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'about-page',
  standalone: true,
  imports: [CommonModule, PublicNavbarComponent, UserNavbarComponent, SiteFooterComponent],
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.css']
})
export class AboutPage {
  constructor(public auth: AuthService, protected tx: TranslationService) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn ? this.auth.isLoggedIn() : false;
  }

  t(key: string): string {
    return this.tx.t(key);
  }
}
