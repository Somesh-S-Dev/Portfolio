import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-weather-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-bg.component.html',
  styleUrls: ['./weather-bg.component.scss']
})
export class WeatherBgComponent implements OnInit {
  themeService = inject(ThemeService);

  rays = Array.from({ length: 12 });
  clouds = Array.from({ length: 6 }, (_, i) => ({
    speed: 20 + i * 8,
    size: 0.6 + Math.random() * 0.8,
    top: 5 + i * 12
  }));
  drops = Array.from({ length: 80 }, (_, i) => ({
    x: Math.random() * 110 - 5,
    delay: Math.random() * 2,
    speed: 0.6 + Math.random() * 0.6
  }));
  streams = Array.from({ length: 8 }, (_, i) => ({
    top: 5 + i * 12,
    speed: 8 + i * 3
  }));
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 4
  }));

  get isNight(): boolean {
    return ['night', 'evening'].includes(this.themeService.currentTheme());
  }

  ngOnInit() {}
}
