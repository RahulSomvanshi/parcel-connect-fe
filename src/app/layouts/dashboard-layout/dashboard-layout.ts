import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { TopNav } from '../../shared/top-nav/top-nav';
import { BottomNav } from '../../shared/bottom-nav/bottom-nav';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Sidebar, TopNav, BottomNav],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  breadcrumbs: { label: string; link?: string }[] = [];
  sidebarOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects || e.url;
        this.updateBreadcrumbs(url);
        this.closeSidebar();
      });

    this.updateBreadcrumbs(this.router.url);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  updateBreadcrumbs(url: string) {
    const map: Record<string, string> = {
      '/dashboard/sender': 'Sender Dashboard',
      '/dashboard/traveller': 'Traveller Dashboard',
      '/dashboard/create-parcel': 'Create Parcel',
      '/dashboard/my-parcels': 'My Parcels',
      '/dashboard/matching-parcels': 'Matching Parcels',
      '/dashboard/my-deliveries': 'My Deliveries',
      '/dashboard/add-travel-plan': 'Add Travel Plan',
      '/dashboard/admin': 'Admin Dashboard',
    };
    const path = url.split('?')[0];
    const label = map[path] || 'Dashboard';
    this.breadcrumbs = [
      { label: 'Dashboard', link: this.authService.getDashboardRoute() },
      { label },
    ];
  }
}
