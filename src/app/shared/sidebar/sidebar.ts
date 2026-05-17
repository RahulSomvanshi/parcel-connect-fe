import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() isOpen = false;
  @Output() menuClose = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onNavClick(): void {
    this.menuClose.emit();
  }

  get userName(): string {
    return this.authService.currentUser?.fullName || 'User';
  }

  get userRole() {
    return this.authService.userRole;
  }

  get roleLabel(): string {
    return this.authService.getRoleLabel();
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

  get adminLinks() {
    return [
      { path: '/dashboard/admin', icon: 'admin_panel_settings', label: 'Admin Panel' },
    ];
  }

  get links() {
    if (this.userRole === 'admin') return this.adminLinks;
    if (this.userRole === 'traveller') return this.travellerLinks;
    if (this.userRole === 'sender') return this.senderLinks;
    return [];
  }

  logout() {
    this.authService.logout();
  }
}
