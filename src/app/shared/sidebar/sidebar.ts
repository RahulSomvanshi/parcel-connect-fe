import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() userType: 'sender' | 'traveller' = 'sender';
  @Input() userName: string = 'User';

  get senderLinks() {
    return [
      { path: '/dashboard/sender', icon: 'dashboard', label: 'Dashboard' },
      { path: '/dashboard/create-parcel', icon: 'add_box', label: 'Create Parcel' },
      { path: '/dashboard/my-parcels', icon: 'local_shipping', label: 'My Parcels' },
      { path: '/dashboard/my-deliveries', icon: 'history', label: 'History' },
    ];
  }

  get travellerLinks() {
    return [
      { path: '/dashboard/traveller', icon: 'dashboard', label: 'Dashboard' },
      { path: '/dashboard/matching-parcels', icon: 'local_shipping', label: 'Active Tasks' },
      { path: '/dashboard/add-travel-plan', icon: 'flight', label: 'Add Travel' },
      { path: '/dashboard/my-deliveries', icon: 'history', label: 'History' },
    ];
  }

  get links() {
    return this.userType === 'sender' ? this.senderLinks : this.travellerLinks;
  }
}
