import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  private mobileOpenSubject = new BehaviorSubject<boolean>(false);

  public isCollapsed$ = this.collapsedSubject.asObservable();
  public isMobileOpen$ = this.mobileOpenSubject.asObservable();

  public isMobile$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {
    // Auto-collapse on mobile
    this.isMobile$.subscribe(isMobile => {
      if (isMobile) {
        this.collapsedSubject.next(true);
        this.mobileOpenSubject.next(false);
      }
    });
  }

  toggleSidebar(isMobile: boolean = false): void {
    if (isMobile) {
      this.mobileOpenSubject.next(!this.mobileOpenSubject.value);
    } else {
      this.collapsedSubject.next(!this.collapsedSubject.value);
    }
  }

  closeMobileSidebar(): void {
    this.mobileOpenSubject.next(false);
  }

  getSidebarWidth(isCollapsed: boolean, isMobile: boolean): string {
    if (isMobile) return '256px';
    return isCollapsed ? '64px' : '256px';
  }

  getMainContentMargin(isCollapsed: boolean, isMobile: boolean): string {
    if (isMobile) return '0px';
    return isCollapsed ? '64px' : '256px';
  }

  get isCollapsed(): boolean {
    return this.collapsedSubject.value;
  }

  get isMobileOpen(): boolean {
    return this.mobileOpenSubject.value;
  }
}