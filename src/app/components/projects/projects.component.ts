import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubService } from '../../services/github.service';
import { DataService } from '../../services/data.service';
import { GitHubRepo, Profile } from '../../models/portfolio.models';
import { marked } from 'marked';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private githubService = inject(GitHubService);
  private dataService = inject(DataService);

  profile = signal<Profile | null>(null);
  repos = signal<GitHubRepo[]>([]);
  loading = signal(true);
  error = signal(false);
  selectedRepo = signal<GitHubRepo | null>(null);
  isClosing = signal(false);

  readonly LANG_COLORS: Record<string, string> = {
    TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', C: '#555555',
    'C++': '#f34b7d', CSS: '#563d7c', HTML: '#e34c26', Vue: '#42b883',
    Ruby: '#701516', Swift: '#fa7343', Kotlin: '#A97BFF', Dart: '#00B4AB',
    PHP: '#4F5D95', Shell: '#89e051', Dockerfile: '#384d54', SCSS: '#c6538c',
  };

  ngOnInit() {
    this.dataService.getProfile().subscribe(p => {
      this.profile.set(p);
      this.loadRepos(p.github);
    });
  }

  loadRepos(username: string) {
    this.loading.set(true);
    this.githubService.getRepos(username).subscribe({
      next: (repos) => {
        this.repos.set(repos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  openRepo(repo: GitHubRepo) {
    this.selectedRepo.set(repo);
    this.isClosing.set(false);
  }

  closePopup() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.selectedRepo.set(null);
      this.isClosing.set(false);
    }, 250);
  }

  @HostListener('document:portfolio:escape')
  onEscape() {
    if (this.selectedRepo()) {
      this.closePopup();
    }
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closePopup();
    }
  }

  goToGithub() {
    const p = this.profile();
    if (p) window.open(`https://github.com/${p.github}`, '_blank');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getLangColor(lang: string | null): string {
    if (!lang) return 'var(--text-muted)';
    return this.LANG_COLORS[lang] || 'var(--accent-1)';
  }
}
