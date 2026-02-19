import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { DataService } from '../../services/data.service';
import { Profile, ThemeMode, TimeTheme } from '../../models/portfolio.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  themeService = inject(ThemeService);
  dataService = inject(DataService);

  profile = signal<Profile | null>(null);
  tenure = signal('');
  showThemePanel = signal(false);

  sections = [
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'timeline', label: 'Journey' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'badges', label: 'Badges' },
  ];

  ngOnInit() {
    this.dataService.getProfile().subscribe(p => {
      this.profile.set(p);
      this.computeTenure(p.dateOfJoining);
    });
  }

  computeTenure(doj: string) {
    const start = new Date(doj);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const y = Math.floor(months / 12);
    const m = months % 12;
    let t = '';
    if (y > 0) t += `${y}yr `;
    if (m > 0) t += `${m}mo`;
    this.tenure.set(t.trim() || 'Just joined');
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  setMode(mode: ThemeMode) {
    this.themeService.setMode(mode);
    this.showThemePanel.set(false);
  }

  get themeOptions(): { label: string; mode: ThemeMode }[] {
    return [
      { label: '🕐 Dynamic (Auto)', mode: 'dynamic' },
      { label: '☀️ Light', mode: 'light' },
      { label: '🌙 Dark', mode: 'dark' },
    ];
  }
}
