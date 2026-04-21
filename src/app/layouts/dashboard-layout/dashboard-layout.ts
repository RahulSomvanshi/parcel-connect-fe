import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { TopNav } from '../../shared/top-nav/top-nav';
import { BottomNav } from '../../shared/bottom-nav/bottom-nav';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Sidebar, TopNav, BottomNav],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  userType: 'sender' | 'traveller' | 'admin' = 'sender';
  breadcrumbs: { label: string; link?: string }[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.urlAfterRedirects || e.url;
        if (url.includes('/dashboard/admin')) {
          this.userType = 'admin';
        } else if (url.includes('traveller') || url.includes('matching') || url.includes('my-deliveries') || url.includes('add-travel')) {
          this.userType = 'traveller';
        } else {
          this.userType = 'sender';
        }
        this.updateBreadcrumbs(url);
      });
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
    const label = map[url] || 'Dashboard';
    let homeLink = '/dashboard/sender';
    if (this.userType === 'traveller') {
      homeLink = '/dashboard/traveller';
    } else if (this.userType === 'admin') {
      homeLink = '/dashboard/admin';
    }
    this.breadcrumbs = [
      { label: 'Dashboard', link: homeLink },
      { label },
    ];
  }
}
