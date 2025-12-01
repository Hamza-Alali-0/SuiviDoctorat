import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicNavbarComponent } from '../../components/navbar/public-navbar';
import { UserNavbarComponent } from '../../components/navbar/user-navbar';
import { SiteFooterComponent } from '../../components/footer/site-footer.component';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'contact-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicNavbarComponent, UserNavbarComponent, SiteFooterComponent],
  templateUrl: './contact-page.html',
  styleUrls: ['./contact-page.css']
})
export class ContactPage {
  constructor(private auth: AuthService, protected tx: TranslationService) {}

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  t(key: string): string {
    return this.tx.t(key);
  }
}
