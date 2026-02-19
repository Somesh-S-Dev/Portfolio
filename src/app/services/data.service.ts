import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Profile, Education, Experience, Certification, Badge, TimelineEvent } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>('assets/data/profile.json');
  }

  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>('assets/data/education.json');
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>('assets/data/experience.json').pipe(
      map(data => this.sortById(data))
    );
  }

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>('assets/data/certifications.json').pipe(
      map(data => this.sortById(data))
    );
  }

  getBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>('assets/data/badges.json').pipe(
      map(data => this.sortById(data))
    );
  }

  getTimeline(): Observable<TimelineEvent[]> {
    return this.http.get<TimelineEvent[]>('assets/data/timeline.json');
  }

  private sortById<T extends { id: string }>(items: T[]): T[] {
    return [...items].sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' })
    );
  }
}
