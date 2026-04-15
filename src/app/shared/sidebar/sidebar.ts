import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() userType: 'sender' | 'traveller' = 'sender';

  constructor(private authService: AuthService, private router: Router) {}

  get userName(): string {
    return this.authService.currentUser?.fullName || 'User';
  }

  get senderLinks() {
    return [
      { path: '/dashboard/sender', icon: 'dashboard', label: 'Dashboard' },
      { path: '/dashboard/create-parcel', icon: 'add_box', label: 'Create Parcel' },
      { path: '/dashboard/my-parcels', icon: 'local_shipping', label: 'My Parcels' },
    ];
  }

  get travellerLinks() {
    return [
      { path: '/dashboard/traveller', icon: 'dashboard', label: 'Dashboard' },
      { path: '/dashboard/add-travel-plan', icon: 'flight', label: 'Add Travel' },
      { path: '/dashboard/matching-parcels', icon: 'local_shipping', label: 'Matching Parcels' },
      { path: '/dashboard/my-deliveries', icon: 'history', label: 'My Deliveries' },
    ];
  }

  get links() {
    return this.userType === 'sender' ? this.senderLinks : this.travellerLinks;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
