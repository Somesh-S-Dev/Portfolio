import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Badge } from '../../models/portfolio.models';

@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {
  private dataService = inject(DataService);
  badges = signal<Badge[]>([]);
  hoveredBadge = signal<Badge | null>(null);
  tooltipPos = signal({ x: 0, y: 0 });

  ngOnInit() {
    this.dataService.getBadges().subscribe(b => this.badges.set(b));
  }

  onBadgeHover(badge: Badge, event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tooltipPos.set({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    this.hoveredBadge.set(badge);
  }

  onBadgeLeave() {
    this.hoveredBadge.set(null);
  }

  openBadge(badge: Badge) {
    if (badge.credlyUrl) window.open(badge.credlyUrl, '_blank');
  }
}
