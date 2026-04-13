import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
  @Input() userType: 'sender' | 'traveller' = 'sender';

  get links() {
    if (this.userType === 'sender') {
      return [
        { path: '/dashboard/sender', icon: 'dashboard', label: 'Dashboard' },
        { path: '/dashboard/create-parcel', icon: 'work', label: 'Tasks' },
        { path: '/dashboard/my-parcels', icon: 'history', label: 'History' },
      ];
    }
    return [
      { path: '/dashboard/traveller', icon: 'dashboard', label: 'Dashboard' },
      { path: '/dashboard/matching-parcels', icon: 'work', label: 'Tasks' },
      { path: '/dashboard/my-deliveries', icon: 'history', label: 'History' },
    ];
  }
}
