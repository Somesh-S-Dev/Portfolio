import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Certification } from '../../models/portfolio.models';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent implements OnInit {
  private dataService = inject(DataService);
  certs = signal<Certification[]>([]);
  selectedCert = signal<Certification | null>(null);
  isClosing = signal(false);

  ngOnInit() {
    this.dataService.getCertifications().subscribe(c => this.certs.set(c));
  }

  openCert(cert: Certification) {
    this.selectedCert.set(cert);
  }

  closePopup() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.selectedCert.set(null);
      this.isClosing.set(false);
    }, 250);
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closePopup();
    }
  }
}
