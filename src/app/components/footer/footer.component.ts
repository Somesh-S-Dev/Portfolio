import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Profile } from '../../models/portfolio.models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private dataService = inject(DataService);
  profile = signal<Profile | null>(null);

  ngOnInit() {
    this.dataService.getProfile().subscribe(p => this.profile.set(p));
  }

  getYear(): number {
    return new Date().getFullYear();
  }

  // QR code URL using Google Charts API (no key required)
  getQrUrl(resumeUrl: string): string {
    const driveUrl = "https://drive.google.com/file/d/1ndnAO5ze_NrYDZ1uzB-PXVm25O_8TOOD/preview";
    return `https://quickchart.io/qr?text=${encodeURIComponent(driveUrl)}&chco=7c6fff&chld=L|2`;    }
}
