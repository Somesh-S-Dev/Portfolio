import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from './services/theme.service';
import { WeatherService } from './services/weather.service';

import { WeatherBgComponent } from './components/weather-bg/weather-bg.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CertificationsComponent } from './components/certifications/certifications.component';
import { BadgesComponent } from './components/badges/badges.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollNavComponent } from './components/scroll-nav/scroll-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WeatherBgComponent,
    HeaderComponent,
    AboutComponent,
    ContactComponent,
    TimelineComponent,
    EducationComponent,
    ExperienceComponent,
    ProjectsComponent,
    CertificationsComponent,
    BadgesComponent,
    FooterComponent,
    ScrollNavComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private weatherService = inject(WeatherService);

  ngOnInit() {
    this.themeService.init();
    this.weatherService.init();
    this.initScrollReveal();
    this.listenForEscape();
  }

  private initScrollReveal() {
    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        }),
        { threshold: 0.08 }
      );
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 300);
  }

  private listenForEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.dispatchEvent(new CustomEvent('portfolio:escape'));
      }
    });
  }
}
