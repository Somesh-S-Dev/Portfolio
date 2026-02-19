import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Education } from '../../models/portfolio.models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  private dataService = inject(DataService);
  education = signal<Education[]>([]);

  ngOnInit() {
    this.dataService.getEducation().subscribe(e => this.education.set(e));
  }

  yearRange(e: Education): string {
    return `${e.yearStart} — ${e.yearEnd}`;
  }

  duration(e: Education): string {
    const d = e.yearEnd - e.yearStart;
    return `${d} ${d === 1 ? 'Year' : 'Years'}`;
  }

  hasImage(e: Education): boolean {
    return !!e.image && !e.image.includes('placeholder');
  }
}
