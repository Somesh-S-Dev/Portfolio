import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GitHubRepo } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private http = inject(HttpClient);
  private apiBase = 'https://api.github.com';

  getRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${this.apiBase}/users/${username}/repos?sort=updated&per_page=20&type=public`
    ).pipe(
      map(repos => repos.filter(r => !r.fork && !r.archived)),
      catchError(() => of([]))
    );
  }

  getReadme(username: string, repo: string): Observable<string> {
    return this.http.get(
      `${this.apiBase}/repos/${username}/${repo}/readme`,
      { headers: { Accept: 'application/vnd.github.raw' }, responseType: 'text' }
    ).pipe(catchError(() => of('# No README available')));
  }
}
