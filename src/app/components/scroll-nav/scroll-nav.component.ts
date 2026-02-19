import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Profile } from '../../models/portfolio.models';

@Component({
  selector: 'app-scroll-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-nav.component.html',
  styleUrls: ['./scroll-nav.component.scss']
})
export class ScrollNavComponent {
  private dataService = inject(DataService);
  showTop = signal(false);
  profile = signal<Profile | null>(null);

  constructor() {
    this.dataService.getProfile().subscribe(p => this.profile.set(p));
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openLinkedIn() {
    const p = this.profile();
    if (p?.linkedin) window.open(p.linkedin + '/messaging/compose', '_blank');
  }
}
