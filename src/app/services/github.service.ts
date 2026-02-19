import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { GitHubRepo } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private http = inject(HttpClient);
  private apiBase = 'https://api.github.com';
  private CACHE_KEY = 'github_repos_cache';
  private CACHE_TIME_KEY = 'github_repos_cache_time';
  private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  getRepos(username: string): Observable<GitHubRepo[]> {
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    const cachedTime = localStorage.getItem(this.CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedData && cachedTime && (now - Number(cachedTime) < this.CACHE_DURATION)) {
      try {
        return of(JSON.parse(cachedData));
      } catch (e) {
        localStorage.removeItem(this.CACHE_KEY);
        localStorage.removeItem(this.CACHE_TIME_KEY);
      }
    }

    return this.http.get<GitHubRepo[]>(
      `${this.apiBase}/users/${username}/repos?sort=updated&per_page=20&type=public`
    ).pipe(
      map(repos => repos.filter(r => !r.fork && !r.archived)),
      tap(repos => {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(repos));
        localStorage.setItem(this.CACHE_TIME_KEY, now.toString());
      }),
      catchError(() => of([]))
    );
  }
}
