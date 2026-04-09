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
  leaves = [
    { top: 8,  dur: 10, delay: 0,   size: 1.0,  type: 'green' },
    { top: 20, dur: 14, delay: -3,  size: 0.7,  type: 'dried' },
    { top: 32, dur: 12, delay: -7,  size: 0.85, type: 'green' },
    { top: 45, dur: 16, delay: -2,  size: 0.6,  type: 'dried' },
    { top: 55, dur: 11, delay: -9,  size: 0.9,  type: 'dried' },
    { top: 65, dur: 18, delay: -5,  size: 0.55, type: 'green' },
    { top: 75, dur: 13, delay: -1,  size: 0.75, type: 'dried' },
    { top: 85, dur: 15, delay: -6,  size: 0.65, type: 'green' },
  ];
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 4
  }));
  snowflakes = Array.from({ length: 60 }, () => ({
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    speed: 4 + Math.random() * 6,
    drift: -20 + Math.random() * 40
  }));

  get isNight(): boolean {
    return ['night', 'evening'].includes(this.themeService.currentTheme());
  }

  ngOnInit() { }
}
