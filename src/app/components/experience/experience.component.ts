import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Experience } from '../../models/portfolio.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  private dataService = inject(DataService);
  experiences = signal<Experience[]>([]);
  proofExpId = signal<string | null>(null);
  proofPosition = signal({ x: 0, y: 0 });

  ngOnInit() {
    this.dataService.getExperience().subscribe(e => this.experiences.set(e));
  }

  formatDate(date: string | null): string {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getDuration(from: string, to: string | null): string {
    const start = new Date(from);
    const end = to ? new Date(to) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const y = Math.floor(months / 12);
    const m = months % 12;
    let s = '';
    if (y > 0) s += `${y}y `;
    if (m > 0) s += `${m}m`;
    return s.trim() || '< 1m';
  }

  showProof(exp: Experience, event: MouseEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.proofPosition.set({ x: rect.left, y: rect.bottom + 10 });
    this.proofExpId.set(exp.id);
  }

  hideProof() {
    this.proofExpId.set(null);
  }

  @HostListener('document:portfolio:escape')
  onEscape() {
    if (this.proofExpId()) {
      this.hideProof();
    }
  }


  getProofExp(): Experience | undefined {
    return this.experiences().find(e => e.id === this.proofExpId());
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'full-time': 'Full Time',
      'internship': 'Internship',
      'part-time': 'Part Time',
      'contract': 'Contract'
    };
    return labels[type] || type;
  }
}
