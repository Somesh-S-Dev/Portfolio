import { Injectable, signal } from '@angular/core';
import { TimeTheme, ThemeMode, WeatherCondition } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  mode = signal<ThemeMode>('dynamic');
  currentTheme = signal<TimeTheme>('night');
  weather = signal<WeatherCondition>('unknown');
  isTransitioning = signal(false);

  private themeInterval?: ReturnType<typeof setInterval>;

  init() {
    this.applyTheme('night');
    // Start from dark and transition to current time theme
    setTimeout(() => this.updateTimeTheme(), 2000);
    // Update every hour
    this.themeInterval = setInterval(() => {
      if (this.mode() === 'dynamic') this.updateTimeTheme();
    }, 60 * 60 * 1000);
  }

  getThemeForHour(hour: number): TimeTheme {
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 15) return 'noon';
    if (hour >= 15 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  }

  updateTimeTheme() {
    const hour = new Date().getHours();
    const theme = this.getThemeForHour(hour);
    this.transitionToTheme(theme);
  }

  transitionToTheme(theme: TimeTheme) {
    this.isTransitioning.set(true);
    setTimeout(() => {
      this.applyTheme(theme);
      this.currentTheme.set(theme);
      setTimeout(() => this.isTransitioning.set(false), 1800);
    }, 100);
  }

  applyTheme(theme: TimeTheme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  applyWeather(weather: WeatherCondition) {
    this.weather.set(weather);
    document.documentElement.setAttribute('data-weather', weather);
  }

  setMode(mode: ThemeMode) {
    this.mode.set(mode);
    if (mode === 'light') {
      this.transitionToTheme('morning');
    } else if (mode === 'dark') {
      this.transitionToTheme('night');
    } else {
      this.updateTimeTheme();
    }
  }

  getThemeLabel(theme: TimeTheme): string {
    const labels: Record<TimeTheme, string> = {
      dawn: '🌅 Dawn',
      morning: '☀️ Morning',
      noon: '🌞 Noon',
      afternoon: '🌇 Afternoon',
      evening: '🌆 Evening',
      night: '🌙 Night',
    };
    return labels[theme];
  }

  isDark(): boolean {
    return ['night', 'evening', 'afternoon', 'dawn'].includes(this.currentTheme());
  }
}
