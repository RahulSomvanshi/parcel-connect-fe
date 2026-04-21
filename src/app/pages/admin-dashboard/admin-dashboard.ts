import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { AdminUser, AdminParcel, AdminParcelUser, PaginationInfo } from '../../core/services/admin.service';
import * as AdminActions from '../../store/admin/admin.actions';
import * as AdminSelectors from '../../store/admin/admin.selectors';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  // Tab control
  activeTab: 'users' | 'parcels' = 'users';

  // Users
  users$: Observable<AdminUser[]>;
  usersPagination$: Observable<PaginationInfo>;
  usersLoading$: Observable<boolean>;
  usersError$: Observable<string | null>;

  // Parcels
  parcels$: Observable<AdminParcel[]>;
  parcelsPagination$: Observable<PaginationInfo>;
  parcelsLoading$: Observable<boolean>;
  parcelsError$: Observable<string | null>;

  // Totals
  totalUsers$: Observable<number>;
  totalParcels$: Observable<number>;

  // Current page tracking
  currentUsersPage = 1;
  currentParcelsPage = 1;
  pageLimit = 10;

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.users$ = this.store.select(AdminSelectors.selectUsers);
    this.usersPagination$ = this.store.select(AdminSelectors.selectUsersPagination);
    this.usersLoading$ = this.store.select(AdminSelectors.selectUsersLoading);
    this.usersError$ = this.store.select(AdminSelectors.selectUsersError);

    this.parcels$ = this.store.select(AdminSelectors.selectAdminParcels);
    this.parcelsPagination$ = this.store.select(AdminSelectors.selectParcelsPagination);
    this.parcelsLoading$ = this.store.select(AdminSelectors.selectParcelsLoading);
    this.parcelsError$ = this.store.select(AdminSelectors.selectParcelsError);

    this.totalUsers$ = this.store.select(AdminSelectors.selectTotalUsers);
    this.totalParcels$ = this.store.select(AdminSelectors.selectTotalParcels);
  }

  ngOnInit() {
    this.loadUsers();
    this.loadParcels();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Tab Switching ──
  switchTab(tab: 'users' | 'parcels') {
    this.activeTab = tab;
  }

  // ── Users Pagination ──
  loadUsers() {
    this.store.dispatch(
      AdminActions.loadUsers({ page: this.currentUsersPage, limit: this.pageLimit })
    );
  }

  goToUsersPage(page: number) {
    this.currentUsersPage = page;
    this.loadUsers();
  }

  prevUsersPage() {
    if (this.currentUsersPage > 1) {
      this.currentUsersPage--;
      this.loadUsers();
    }
  }

  nextUsersPage(totalPages: number) {
    if (this.currentUsersPage < totalPages) {
      this.currentUsersPage++;
      this.loadUsers();
    }
  }

  // ── Parcels Pagination ──
  loadParcels() {
    this.store.dispatch(
      AdminActions.loadAdminParcels({ page: this.currentParcelsPage, limit: this.pageLimit })
    );
  }

  goToParcelsPage(page: number) {
    this.currentParcelsPage = page;
    this.loadParcels();
  }

  prevParcelsPage() {
    if (this.currentParcelsPage > 1) {
      this.currentParcelsPage--;
      this.loadParcels();
    }
  }

  nextParcelsPage(totalPages: number) {
    if (this.currentParcelsPage < totalPages) {
      this.currentParcelsPage++;
      this.loadParcels();
    }
  }

  // ── Helper: generate page numbers ──
  getPageNumbers(totalPages: number): number[] {
    const pages: number[] = [];
    const currentPage = this.activeTab === 'users' ? this.currentUsersPage : this.currentParcelsPage;
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ── Formatters ──
  getRoleBadge(role: string): string {
    return role === 'admin' ? 'chip-error' : 'chip-primary';
  }

  getRoleDisplay(role: string): string {
    return role === 'admin' ? 'Admin' : 'User';
  }

  getVerifiedBadge(isVerified: boolean): string {
    return isVerified ? 'chip-success' : 'chip-warning';
  }

  getVerifiedDisplay(isVerified: boolean): string {
    return isVerified ? 'Verified' : 'Unverified';
  }

  getStatusType(status: string): string {
    switch (status) {
      case 'searching': return 'secondary';
      case 'matched': return 'primary';
      case 'in_transit': return 'warning';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  }

  getStatusDisplay(status: string): string {
    switch (status) {
      case 'searching': return 'Searching';
      case 'matched': return 'Matched';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  }

  getSenderName(sender: AdminParcel['sender']): string {
    if (!sender) return '—';
    if (typeof sender === 'string') return sender;
    return sender.fullName || '—';
  }

  getSenderPhone(sender: AdminParcel['sender']): string {
    if (!sender || typeof sender === 'string') return '';
    return sender.phone || '';
  }

  getTravellerName(traveller: AdminParcel['traveller']): string {
    if (!traveller) return 'Unassigned';
    if (typeof traveller === 'string') return traveller;
    return traveller.fullName || 'Unassigned';
  }

  getTravellerPhone(traveller: AdminParcel['traveller']): string {
    if (!traveller || typeof traveller === 'string') return '';
    return traveller.phone || '';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  retryUsers() {
    this.loadUsers();
  }

  retryParcels() {
    this.loadParcels();
  }
}
