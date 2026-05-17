import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  AdminUser,
  AdminParcel,
  AdminParcelUser,
  PaginationInfo,
  AdminService,
  AdminStats,
  AdminProhibitedItemsResponse,
} from '../../core/services/admin.service';
import * as AdminActions from '../../store/admin/admin.actions';
import * as AdminSelectors from '../../store/admin/admin.selectors';
import { parcelStatusBadge, parcelStatusLabel } from '../../core/utils/parcel-status.util';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  // Tab control
  activeTab: 'overview' | 'users' | 'parcels' | 'add-traveller' | 'add-trip' | 'disclaimer' = 'overview';

  adminStats: AdminStats | null = null;
  dashboardLoading = false;
  statsLoading = false;
  statsError: string | null = null;

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
  pageLimit = 5;

  // Add Traveller form
  travellerForm!: FormGroup;
  addingTraveller = false;
  travellerSuccess: string | null = null;
  travellerError: string | null = null;

  // Add Trip form
  tripForm!: FormGroup;
  addingTrip = false;
  tripSuccess: string | null = null;
  tripError: string | null = null;
  travellers: AdminUser[] = [];

  prohibitedData: AdminProhibitedItemsResponse | null = null;
  disclaimerForm!: FormGroup;
  savingDisclaimer = false;
  disclaimerSuccess: string | null = null;
  disclaimerError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
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
    this.initForms();
    this.loadDashboard();
  }

  /** One API call — backend loads stats, users, parcels, travellers via Promise.all */
  loadDashboard() {
    this.dashboardLoading = true;
    this.statsLoading = true;
    this.statsError = null;

    this.adminService.getDashboard(this.currentUsersPage, this.pageLimit).subscribe({
      next: (bundle) => {
        this.adminStats = bundle.stats;
        this.travellers = bundle.travellers;
        this.store.dispatch(
          AdminActions.loadUsersSuccess({
            users: bundle.users.data,
            pagination: bundle.users.pagination,
          })
        );
        this.store.dispatch(
          AdminActions.loadAdminParcelsSuccess({
            parcels: bundle.parcels.data,
            pagination: bundle.parcels.pagination,
          })
        );
        this.dashboardLoading = false;
        this.statsLoading = false;
      },
      error: (err) => {
        this.statsError = err.error?.message || 'Failed to load admin dashboard';
        this.dashboardLoading = false;
        this.statsLoading = false;
      },
    });
  }

  loadStats() {
    this.statsLoading = true;
    this.statsError = null;
    this.adminService.getAdminStats().subscribe({
      next: (stats) => {
        this.adminStats = stats;
        this.statsLoading = false;
      },
      error: (err) => {
        this.statsError = err.error?.message || 'Failed to load dashboard stats';
        this.statsLoading = false;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms() {
    this.travellerForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.tripForm = this.fb.group({
      userId: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      travelDate: ['', Validators.required],
      vehicleType: ['', Validators.required],
      availableWeight: ['', [Validators.required, Validators.min(0.1)]],
    });

    this.disclaimerForm = this.fb.group({
      customItemsText: [''],
    });
  }

  private loadTravellers() {
    this.adminService.getTravellers(1, 100).subscribe({
      next: (res) => (this.travellers = res.data),
      error: () => {},
    });
  }

  // ── Tab Switching ──
  switchTab(tab: 'overview' | 'users' | 'parcels' | 'add-traveller' | 'add-trip' | 'disclaimer') {
    this.activeTab = tab;
    if (tab === 'add-trip') this.loadTravellers();
    if (tab === 'users') this.loadUsers();
    if (tab === 'parcels') this.loadParcels();
    if (tab === 'disclaimer') this.loadProhibitedItems();
  }

  // ── Add Traveller ──
  onAddTraveller() {
    if (this.travellerForm.invalid) { this.travellerForm.markAllAsTouched(); return; }
    this.addingTraveller = true;
    this.travellerSuccess = null;
    this.travellerError = null;

    this.adminService.createTravellerUser(this.travellerForm.value).subscribe({
      next: (res) => {
        this.addingTraveller = false;
        this.travellerSuccess = res.message || 'Traveller added successfully!';
        this.travellerForm.reset();
        this.loadDashboard();
        setTimeout(() => this.travellerSuccess = null, 4000);
      },
      error: (err) => {
        this.addingTraveller = false;
        this.travellerError = err.error?.message || 'Failed to create traveller';
        setTimeout(() => this.travellerError = null, 4000);
      }
    });
  }

  // ── Add Trip ──
  onAddTrip() {
    if (this.tripForm.invalid) { this.tripForm.markAllAsTouched(); return; }
    this.addingTrip = true;
    this.tripSuccess = null;
    this.tripError = null;

    this.adminService.createTravelPlan(this.tripForm.value).subscribe({
      next: (res) => {
        this.addingTrip = false;
        this.tripSuccess = res.message || 'Trip added successfully!';
        this.tripForm.reset();
        this.loadDashboard();
        setTimeout(() => this.tripSuccess = null, 4000);
      },
      error: (err) => {
        this.addingTrip = false;
        this.tripError = err.error?.message || 'Failed to create trip';
        setTimeout(() => this.tripError = null, 4000);
      }
    });
  }

  // ── Users Pagination ──
  loadUsers() {
    this.store.dispatch(AdminActions.loadUsers({ page: this.currentUsersPage, limit: this.pageLimit }));
  }

  goToUsersPage(page: number) { this.currentUsersPage = page; this.loadUsers(); }
  prevUsersPage() { if (this.currentUsersPage > 1) { this.currentUsersPage--; this.loadUsers(); } }
  nextUsersPage(totalPages: number) { if (this.currentUsersPage < totalPages) { this.currentUsersPage++; this.loadUsers(); } }

  // ── Parcels Pagination ──
  loadParcels() {
    this.store.dispatch(AdminActions.loadAdminParcels({ page: this.currentParcelsPage, limit: this.pageLimit }));
  }

  goToParcelsPage(page: number) { this.currentParcelsPage = page; this.loadParcels(); }
  prevParcelsPage() { if (this.currentParcelsPage > 1) { this.currentParcelsPage--; this.loadParcels(); } }
  nextParcelsPage(totalPages: number) { if (this.currentParcelsPage < totalPages) { this.currentParcelsPage++; this.loadParcels(); } }

  // ── Helper: generate page numbers ──
  getPageNumbers(totalPages: number): number[] {
    const pages: number[] = [];
    const currentPage = this.activeTab === 'users' ? this.currentUsersPage : this.currentParcelsPage;
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // ── Formatters ──
  getRoleBadge(role: string): string {
    if (role === 'admin') return 'chip-error';
    if (role === 'traveller') return 'chip-success';
    return 'chip-primary';
  }

  getRoleDisplay(role: string): string {
    if (role === 'admin') return 'Admin';
    if (role === 'traveller') return 'Traveller';
    return 'Sender';
  }

  getVerifiedBadge(isVerified: boolean): string { return isVerified ? 'chip-success' : 'chip-warning'; }
  getVerifiedDisplay(isVerified: boolean): string { return isVerified ? 'Verified' : 'Unverified'; }

  getStatusType(status: string): string {
    return parcelStatusBadge(status);
  }

  getStatusDisplay(status: string): string {
    return parcelStatusLabel(status);
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
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  }

  retryUsers() { this.loadUsers(); }
  retryParcels() { this.loadParcels(); }
  retryStats() { this.loadDashboard(); }

  loadProhibitedItems() {
    this.adminService.getProhibitedItems().subscribe({
      next: (data) => {
        this.prohibitedData = data;
        this.disclaimerForm.patchValue(
          { customItemsText: (data.customItems || []).join(', ') },
          { emitEvent: false }
        );
      },
      error: (err) => {
        this.disclaimerError = err.error?.message || 'Failed to load prohibited items';
      },
    });
  }

  saveProhibitedItems() {
    const raw = String(this.disclaimerForm.value.customItemsText || '');
    const items = raw
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);

    this.savingDisclaimer = true;
    this.disclaimerSuccess = null;
    this.disclaimerError = null;
    this.adminService.updateProhibitedItems(items).subscribe({
      next: (res) => {
        this.savingDisclaimer = false;
        this.disclaimerSuccess = res.message || 'Disclaimer items updated';
        this.loadProhibitedItems();
        setTimeout(() => (this.disclaimerSuccess = null), 3000);
      },
      error: (err) => {
        this.savingDisclaimer = false;
        this.disclaimerError = err.error?.message || 'Failed to update prohibited items';
      },
    });
  }
}
