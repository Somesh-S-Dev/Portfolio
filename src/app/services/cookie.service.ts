import { Injectable } from '@angular/core';
import { ContactSession } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class CookieService {
  private readonly KEY = 'portfolio_contact_session';

  saveSession(session: ContactSession): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `${this.KEY}=${encodeURIComponent(JSON.stringify(session))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  getSession(): ContactSession | null {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${this.KEY}=([^;]*)`));
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return null;
    }
  }

  clearSession(): void {
    document.cookie = `${this.KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
