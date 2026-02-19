import {
  Component, OnInit, OnDestroy, inject, signal,
  ElementRef, ViewChild, AfterViewInit, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { TimelineEvent } from '../../models/portfolio.models';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  private dataService = inject(DataService);
  private zone = inject(NgZone);

  @ViewChild('track') trackRef!: ElementRef<HTMLElement>;
  @ViewChild('rail') railRef!: ElementRef<HTMLElement>;

  events = signal<TimelineEvent[]>([]);
  activeId = signal<string | null>(null);
  expandedId = signal<string | null>(null);
  progressWidth = signal(0);

  // Drag-scroll state
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private dragMoved = false;
  private cleanups: (() => void)[] = [];
  private scrollRAF?: number;

  // Auto-scroll on load to today's approximate position
  private scrollAnimFrame?: number;

  readonly TYPE_META: Record<string, { color: string; label: string }> = {
    education:     { color: 'var(--accent-1)',   label: 'Education' },
    work:          { color: 'var(--accent-3)',   label: 'Work' },
    certification: { color: 'var(--accent-2)',   label: 'Certification' },
    project:       { color: '#ffd060',           label: 'Project' },
    achievement:   { color: '#a78bfa',           label: 'Achievement' },
  };

  ngOnInit() {
    this.dataService.getTimeline().subscribe(events => {
      // Sort chronologically
      const sorted = [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      this.events.set(sorted);
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.setupDragScroll();
      this.setupProgressUpdater();
      setTimeout(() => this.scrollToCurrentPosition(), 400);
    });
  }

  ngOnDestroy() {
    this.cleanups.forEach(fn => fn());
    if (this.scrollRAF) cancelAnimationFrame(this.scrollRAF);
    if (this.scrollAnimFrame) cancelAnimationFrame(this.scrollAnimFrame);
  }

  // ── Getters ────────────────────────────────────────────────

  getRelativeX(index: number, total: number): number {
    // Distribute nodes evenly, 5% padding on each side
    return total === 1 ? 50 : 5 + (index / (total - 1)) * 90;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr + '-01');
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  formatYear(dateStr: string): string {
    return new Date(dateStr + '-01').getFullYear().toString();
  }

  /** Which side the label pops — alternate above/below to avoid crowding */
  getLabelSide(index: number): 'above' | 'below' {
    return index % 2 === 0 ? 'above' : 'below';
  }

  getTypeColor(type: string): string {
    return this.TYPE_META[type]?.color ?? 'var(--accent-1)';
  }

  getTypeLabel(type: string): string {
    return this.TYPE_META[type]?.label ?? type;
  }

  // ── Interaction ─────────────────────────────────────────────

  onNodeClick(event: TimelineEvent, e: MouseEvent): void {
    if (this.dragMoved) return; // ignore click after drag
    this.zone.run(() => {
      if (this.expandedId() === event.id) {
        this.expandedId.set(null);
        this.activeId.set(null);
      } else {
        this.expandedId.set(event.id);
        this.activeId.set(event.id);
        // Scroll node into horizontal center of the rail
        this.centerNode(e.currentTarget as HTMLElement);
        // Navigate to section after brief delay
        setTimeout(() => this.scrollToSection(event.sectionId), 700);
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const offset = 90; // header height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  private centerNode(nodeEl: HTMLElement): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;
    const nodeCenter = nodeEl.offsetLeft + nodeEl.offsetWidth / 2;
    const railCenter = rail.clientWidth / 2;
    rail.scrollTo({ left: nodeCenter - railCenter, behavior: 'smooth' });
  }

  // ── Progress bar ────────────────────────────────────────────

  private setupProgressUpdater(): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;
    const update = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const pct = maxScroll > 0 ? (rail.scrollLeft / maxScroll) * 100 : 0;
      this.zone.run(() => this.progressWidth.set(pct));
      this.scrollRAF = requestAnimationFrame(update);
    };
    this.scrollRAF = requestAnimationFrame(update);
  }

  // ── Auto-scroll to current time position ────────────────────

  private scrollToCurrentPosition(): void {
    const events = this.events();
    const rail = this.railRef?.nativeElement;
    if (!events.length || !rail) return;

    const now = Date.now();
    const first = new Date(events[0].date + '-01').getTime();
    const last  = new Date(events[events.length - 1].date + '-01').getTime();
    const span  = last - first;
    if (span <= 0) return;

    const pct = Math.min(1, Math.max(0, (now - first) / span));
    const target = (rail.scrollWidth - rail.clientWidth) * pct;

    // Animate scroll from 0 → target
    const duration = 1200;
    const start = performance.now();
    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (ts: number) => {
      const progress = Math.min(1, (ts - start) / duration);
      rail.scrollLeft = target * ease(progress);
      if (progress < 1) {
        this.scrollAnimFrame = requestAnimationFrame(step);
      }
    };
    this.scrollAnimFrame = requestAnimationFrame(step);
  }

  // ── Drag to scroll ───────────────────────────────────────────

  private setupDragScroll(): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;

    const onDown = (e: PointerEvent) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.startX = e.pageX - rail.offsetLeft;
      this.scrollLeft = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
      rail.classList.add('dragging');
    };

    const onMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      const dx = (e.pageX - rail.offsetLeft) - this.startX;
      if (Math.abs(dx) > 4) this.dragMoved = true;
      rail.scrollLeft = this.scrollLeft - dx;
    };

    const onUp = () => {
      this.isDragging = false;
      rail.classList.remove('dragging');
      setTimeout(() => { this.dragMoved = false; }, 50);
    };

    rail.addEventListener('pointerdown', onDown);
    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerup', onUp);
    rail.addEventListener('pointercancel', onUp);

    this.cleanups.push(
      () => rail.removeEventListener('pointerdown', onDown),
      () => rail.removeEventListener('pointermove', onMove),
      () => rail.removeEventListener('pointerup', onUp),
      () => rail.removeEventListener('pointercancel', onUp),
    );
  }
}
