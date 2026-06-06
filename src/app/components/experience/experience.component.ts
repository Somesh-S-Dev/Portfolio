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
  isClosing = signal(false);

  ngOnInit() {
    this.dataService.getExperience().subscribe(e => {
      const sorted = [...e].sort((a, b) => {
        const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
        
        const valA = numA === 0 ? Infinity : numA;
        const valB = numB === 0 ? Infinity : numB;
        
        return valB - valA;
      });
      this.experiences.set(sorted);
    });
  }

  formatDate(date: string | null): string {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getDuration(from: string, to: string | null): string {
    const start = new Date(from);
    const end = to ? new Date(to) : new Date();
    
    // Normalize to midnight to avoid daylight saving time offset issues
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    
    const fullMonths = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    
    let totalMonths = fullMonths;
    if (remainingDays >= 15) {
      totalMonths += 0.5;
    }
    
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    
    let s = '';
    if (y > 0) s += `${y}y `;
    if (m > 0) s += `${m}m`;
    
    return s.trim() || '< 1m';
  }

  openProof(exp: Experience) {
    this.proofExpId.set(exp.id);
    this.isClosing.set(false);
  }

  closeProof() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.proofExpId.set(null);
      this.isClosing.set(false);
    }, 250);
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closeProof();
    }
  }

  @HostListener('document:portfolio:escape')
  onEscape() {
    if (this.proofExpId()) {
      this.closeProof();
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
