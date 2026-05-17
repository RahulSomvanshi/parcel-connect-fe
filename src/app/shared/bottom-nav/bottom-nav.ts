import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  constructor(private authService: AuthService) {}

  get links() {
    const role = this.authService.userRole;

    if (role === 'admin') {
      return [
        { path: '/dashboard/admin', icon: 'admin_panel_settings', label: 'Admin' },
      ];
    }

    if (role === 'traveller') {
      return [
        { path: '/dashboard/traveller', icon: 'dashboard', label: 'Dashboard' },
        { path: '/dashboard/matching-parcels', icon: 'local_shipping', label: 'Match' },
        { path: '/dashboard/my-deliveries', icon: 'history', label: 'Deliveries' },
      ];
    }

    if (role === 'sender') {
      return [
        { path: '/dashboard/sender', icon: 'dashboard', label: 'Dashboard' },
        { path: '/dashboard/create-parcel', icon: 'add_box', label: 'Create' },
        { path: '/dashboard/my-parcels', icon: 'history', label: 'Parcels' },
      ];
    }

    return [];
  }
}
