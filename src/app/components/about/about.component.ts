import { Component, OnInit, inject, signal, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Profile } from '../../models/portfolio.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  private dataService = inject(DataService);
  private el = inject(ElementRef);

  profile = signal<Profile | null>(null);
  typedName = signal('');
  private fullName = '';
  private typeIndex = 0;

  ngOnInit() {
    this.dataService.getProfile().subscribe(p => {
      this.profile.set(p);
      this.fullName = p.name;
      this.startTyping();
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    this.el.nativeElement.querySelectorAll('.reveal').forEach((el: Element) => observer.observe(el));
  }

  startTyping() {
    const type = () => {
      if (this.typeIndex <= this.fullName.length) {
        this.typedName.set(this.fullName.slice(0, this.typeIndex));
        this.typeIndex++;
        setTimeout(type, 80);
      }
    };
    setTimeout(type, 500);
  }

  getInitials(name: string | undefined | null): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }


  getSkillGroups(profile: Profile): { key: string; label: string; icon: string; items: string[] }[] {
    return [
      { key: 'languages', label: 'Languages', icon: '{ }', items: profile.skills.languages },
      { key: 'frameworks', label: 'Frameworks', icon: '⚙️', items: profile.skills.frameworks },
      { key: 'tools', label: 'Tools', icon: '🛠️', items: profile.skills.tools },
      { key: 'other', label: 'Expertise', icon: '⚡', items: profile.skills.other },
    ];
  }
}
