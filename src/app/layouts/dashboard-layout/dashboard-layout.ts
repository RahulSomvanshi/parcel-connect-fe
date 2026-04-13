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
  userType: 'sender' | 'traveller' = 'sender';
  breadcrumbs: { label: string; link?: string }[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.urlAfterRedirects || e.url;
        this.userType = url.includes('traveller') || url.includes('matching') || url.includes('my-deliveries') || url.includes('add-travel')
          ? 'traveller' : 'sender';
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
    };
    const label = map[url] || 'Dashboard';
    this.breadcrumbs = [
      { label: 'Dashboard', link: this.userType === 'sender' ? '/dashboard/sender' : '/dashboard/traveller' },
      { label },
    ];
  }
}
