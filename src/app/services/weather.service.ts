import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherCondition } from '../models/portfolio.models';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private themeService = inject(ThemeService);

  // Replace with your OpenWeatherMap API key
  private apiKey = 'YOUR_OPENWEATHER_API_KEY';
  private locationPermission: PermissionState = 'prompt';

  async init() {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      this.locationPermission = result.state;
      if (result.state === 'granted') {
        this.fetchWeatherWithLocation();
      }
      result.onchange = () => {
        this.locationPermission = result.state;
        if (result.state === 'granted') this.fetchWeatherWithLocation();
      };
    } catch {
      // Permissions API not supported
    }
  }

  requestLocationAndFetchWeather() {
    navigator.geolocation.getCurrentPosition(
      (pos) => this.fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  }

  private fetchWeatherWithLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => this.fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  }

  private fetchWeather(lat: number, lon: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        const condition = this.parseWeather(data);
        this.themeService.applyWeather(condition);
      },
      error: () => {}
    });
  }

  private parseWeather(data: any): WeatherCondition {
    const id = data?.weather?.[0]?.id ?? 800;
    const speed = data?.wind?.speed ?? 0;
    if (id >= 200 && id < 700) return 'rain';
    if (id >= 700 && id < 800) return 'cloudy';
    if (id === 800) return speed > 5 ? 'breeze' : 'sunny';
    if (id > 800) return 'cloudy';
    return 'unknown';
  }
}
