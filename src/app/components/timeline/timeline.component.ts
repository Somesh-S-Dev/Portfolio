import {
  Component, OnInit, OnDestroy, inject, signal,
  ElementRef, ViewChild, AfterViewInit, NgZone, computed
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
  currentTime = signal(new Date());
  activeYear = signal<number>(0);

  // Time boundaries for layout
  startTime = signal<number>(0);
  endTime = signal<number>(0);

  // Drag-scroll state
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private dragMoved = false;
  private cleanups: (() => void)[] = [];
  private scrollRAF?: number;
  private timerHandle?: any;

  // Auto-scroll on load to today's approximate position
  private scrollAnimFrame?: number;

  readonly TYPE_META: Record<string, { color: string; label: string }> = {
    education: { color: 'var(--accent-1)', label: 'Education' },
    work: { color: 'var(--accent-3)', label: 'Work' },
    certification: { color: 'var(--accent-2)', label: 'Certification' },
    project: { color: '#ffd060', label: 'Project' },
    achievement: { color: '#a78bfa', label: 'Achievement' },
  };

  // Computed year markers
  yearMarkers = computed(() => {
    const start = this.startTime();
    const end = this.endTime();
    if (!start || !end) return [];

    const years: number[] = [];
    const startYear = new Date(start).getFullYear();
    const endYear = new Date(end).getFullYear();

    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  });

  todayPercentage = computed(() => {
    const now = Date.now();
    const start = this.startTime();
    const end = this.endTime();
    if (!start || !end) return 0;
    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  });

  currentTimeString = computed(() => {
    return this.currentTime().toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  });

  ngOnInit() {
    this.dataService.getTimeline().subscribe(events => {
      const sorted = [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      this.events.set(sorted);

      if (sorted.length > 0) {
        const firstDate = new Date(sorted[0].date);
        const lastDate = new Date(sorted[sorted.length - 1].date);

        // Boundaries: Jan 1 of first year to Dec 31 of last year + 1
        const minDate = new Date(firstDate.getFullYear(), 0, 1);
        const maxDate = new Date(lastDate.getFullYear() + 1, 11, 31);

        this.startTime.set(minDate.getTime());
        this.endTime.set(maxDate.getTime());
      }
    });

    // Update current time every second
    this.zone.runOutsideAngular(() => {
      this.timerHandle = setInterval(() => {
        this.zone.run(() => this.currentTime.set(new Date()));
      }, 1000);
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
    if (this.timerHandle) clearInterval(this.timerHandle);
  }

  // ── Getters ────────────────────────────────────────────────

  getRelativeX(dateStr: string): number {
    const date = new Date(dateStr).getTime();
    const start = this.startTime();
    const end = this.endTime();
    if (!start || !end) return 0;
    return ((date - start) / (end - start)) * 100;
  }

  getYearX(year: number): number {
    const date = new Date(year, 0, 1).getTime();
    const start = this.startTime();
    const end = this.endTime();
    if (!start || !end) return 0;
    return ((date - start) / (end - start)) * 100;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  formatYear(dateStr: string): string {
    return new Date(dateStr).getFullYear().toString();
  }

  getLabelSide(index: number): 'above' | 'below' {
    return index % 2 === 0 ? 'above' : 'below';
  }

  getTypeColor(type: string): string {
    return this.TYPE_META[type]?.color ?? 'var(--accent-1)';
  }

  getTypeLabel(type: string): string {
    return this.TYPE_META[type]?.label ?? type;
  }

  jumpToYear(year: number): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;

    const yearXPercent = this.getYearX(year);
    const yearLeft = (rail.scrollWidth * yearXPercent) / 100;
    const railCenter = rail.clientWidth / 2;

    rail.scrollTo({ left: yearLeft - railCenter, behavior: 'smooth' });
    this.activeYear.set(year);
  }

  // ── Interaction ─────────────────────────────────────────────

  onNodeClick(event: TimelineEvent, e: MouseEvent): void {
    if (this.dragMoved) return;
    this.zone.run(() => {
      if (this.expandedId() === event.id) {
        this.expandedId.set(null);
        this.activeId.set(null);
      } else {
        this.expandedId.set(event.id);
        this.activeId.set(event.id);
        this.centerNode(e.currentTarget as HTMLElement);
        setTimeout(() => this.scrollToSection(event.sectionId), 700);
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const offset = 90;
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

  private setupProgressUpdater(): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;
    const update = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const pct = maxScroll > 0 ? (rail.scrollLeft / maxScroll) * 100 : 0;
      this.zone.run(() => this.progressWidth.set(pct));

      // Update active year based on center of view
      const viewCenter = rail.scrollLeft + rail.clientWidth / 2;
      const centerPct = (viewCenter / rail.scrollWidth) * 100;

      const start = this.startTime();
      const end = this.endTime();
      if (start && end) {
        const centerTime = start + ((end - start) * centerPct) / 100;
        const currentYear = new Date(centerTime).getFullYear();
        if (this.activeYear() !== currentYear) {
          this.zone.run(() => this.activeYear.set(currentYear));
        }
      }

      this.scrollRAF = requestAnimationFrame(update);
    };
    this.scrollRAF = requestAnimationFrame(update);
  }

  private scrollToCurrentPosition(): void {
    const rail = this.railRef?.nativeElement;
    if (!rail) return;

    const pct = this.todayPercentage() / 100;
    const target = (rail.scrollWidth - rail.clientWidth) * pct;

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

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    rail.addEventListener('pointerdown', onDown);
    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerup', onUp);
    rail.addEventListener('pointercancel', onUp);
    rail.addEventListener('wheel', onWheel, { passive: false });

    this.cleanups.push(
      () => rail.removeEventListener('pointerdown', onDown),
      () => rail.removeEventListener('pointermove', onMove),
      () => rail.removeEventListener('pointerup', onUp),
      () => rail.removeEventListener('pointercancel', onUp),
      () => rail.removeEventListener('wheel', onWheel)
    );
  }
}

