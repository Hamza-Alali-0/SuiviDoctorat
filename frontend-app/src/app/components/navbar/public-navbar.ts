import { Component, OnInit, signal, HostListener, ElementRef } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'public-navbar',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive],
	templateUrl: './public-navbar.html',
	styleUrls: ['./public-navbar.css']
})
export class PublicNavbarComponent implements OnInit {
	theme = signal<'light'|'dark'|'system'>('light');
	langMenuOpen = signal(false);
	themeMenuOpen = signal(false);

	constructor(private el: ElementRef, public tx: TranslationService) {}

	ngOnInit() {
		try {
			const rawTheme = (localStorage.getItem('theme') as 'light'|'dark'|'system') || 'light';
			this.theme.set(rawTheme);
			this.applyTheme(rawTheme);
		} catch (e) {}
	}

	get language() {
		return this.tx.current();
	}

	applyTheme(mode: 'light'|'dark'|'system') {
		try {
			if (mode === 'dark') {
				document.documentElement.classList.add('dark');
			} else if (mode === 'light') {
				document.documentElement.classList.remove('dark');
			} else {
				// system: follow prefers-color-scheme
				const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
				document.documentElement.classList.toggle('dark', prefersDark);
			}
		} catch (e) {}
	}

	// Keep a simple toggle that flips between light and dark for quick access
	toggleTheme() {
		const next = this.theme() === 'dark' ? 'light' : 'dark';
		this.setTheme(next);
	}

	toggleThemeMenu() {
		this.themeMenuOpen.update(v => !v);
	}

	setTheme(mode: 'light'|'dark'|'system') {
		this.theme.set(mode);
		try { localStorage.setItem('theme', mode); } catch (e) {}
		this.applyTheme(mode);
		this.themeMenuOpen.set(false);
	}

	changeLanguage() {
		// keep backward-compatible toggle (cycles en -> fr -> ar -> en)
		const current = this.language;
		const next = current === 'en' ? 'fr' : current === 'fr' ? 'ar' : 'en';
		this.setLanguage(next);
	}

	toggleLangMenu() {
		this.langMenuOpen.update(v => !v);
	}

	setLanguage(lang: string) {
		// inform translation service so other components update
		try { this.tx.setLanguage(lang as any); } catch (e) {}
		this.langMenuOpen.set(false);
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: Event) {
		// Use a broad Event type; `event.target` is sufficient for containment checks
		if (!this.el.nativeElement.contains((event as Event).target)) {
			this.langMenuOpen.set(false);
			this.themeMenuOpen.set(false);
		}
	}

	@HostListener('document:keydown.escape', ['$event'])
	onEscape(_event: Event) {
		// Use a broad Event type to avoid strict type mismatches from the compiler
		this.langMenuOpen.set(false);
		this.themeMenuOpen.set(false);
	}
}

