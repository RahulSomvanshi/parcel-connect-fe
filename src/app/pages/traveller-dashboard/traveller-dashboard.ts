import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TravellerService, TravelPlan } from '../../core/services/traveller.service';
import { Parcel } from '../../core/services/parcel.service';
import { TravellerStats } from '../../core/services/stats.service';
import { formatInr, splitEarnings } from '../../core/utils/earnings.util';
import { parcelStatusBadge, parcelStatusLabel } from '../../core/utils/parcel-status.util';

@Component({
  selector: 'app-traveller-dashboard',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './traveller-dashboard.html',
  styleUrl: './traveller-dashboard.css',
})
export class TravellerDashboard implements OnInit {
  private deliveriesSubject = new BehaviorSubject<Parcel[]>([]);
  deliveries$ = this.deliveriesSubject.asObservable();
  myTrips: TravelPlan[] = [];
  tripsLoading = false;
  stats: TravellerStats | null = null;
  statsLoading = false;
  topMatching: Parcel[] = [];
  matchingLoading = false;
  dashboardLoading = false;
  showAllTrips = false;
  currentTripsPage = 1;
  tripPageLimit = 5;
  totalTrips = 0;
  totalTripPages = 0;

  updatingTripId: string | null = null;
  updateError: string | null = null;
  updateSuccess: string | null = null;

  tripStatusOptions = [
    { value: 'PLANNED', label: 'Planned' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  formatInr = formatInr;

  constructor(private travellerService: TravellerService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardLoading = true;
    this.tripsLoading = true;
    this.statsLoading = true;
    this.matchingLoading = true;

    this.travellerService.getDashboard(1, 3).subscribe({
      next: (bundle) => {
        this.myTrips = bundle.trips.data;
        this.totalTrips = bundle.trips.pagination.total;
        this.totalTripPages = bundle.trips.pagination.totalPages;
        this.stats = bundle.stats;
        this.topMatching = bundle.topMatching || [];
        this.deliveriesSubject.next(bundle.recentDeliveries || []);
        this.dashboardLoading = false;
        this.tripsLoading = false;
        this.statsLoading = false;
        this.matchingLoading = false;
      },
      error: () => {
        this.myTrips = [];
        this.totalTrips = 0;
        this.totalTripPages = 0;
        this.stats = null;
        this.topMatching = [];
        this.deliveriesSubject.next([]);
        this.dashboardLoading = false;
        this.tripsLoading = false;
        this.statsLoading = false;
        this.matchingLoading = false;
      },
    });
  }

  onStatusChange(trip: TravelPlan, newStatus: string) {
    if (!trip._id) return;
    this.updatingTripId = trip._id;
    this.updateError = null;
    this.updateSuccess = null;

    this.travellerService.updateTripStatus(trip._id, newStatus as any).subscribe({
      next: () => {
        trip.status = newStatus as any;
        this.updatingTripId = null;
        this.updateSuccess = 'Trip status updated successfully!';
        if (this.showAllTrips) {
          this.loadTripsPage(this.currentTripsPage);
        } else {
          this.loadDashboard();
        }
        setTimeout(() => (this.updateSuccess = null), 3000);
      },
      error: (err) => {
        this.updatingTripId = null;
        this.updateError = err.error?.message || 'Failed to update trip status';
        setTimeout(() => (this.updateError = null), 4000);
      },
    });
  }

  getParcelEarnings(price: number | undefined) {
    return splitEarnings(price || 0);
  }

  viewAllTrips() {
    this.showAllTrips = true;
    this.loadTripsPage(1);
  }

  showRecentTrips() {
    this.showAllTrips = false;
    this.currentTripsPage = 1;
    this.loadDashboard();
  }

  loadTripsPage(page: number) {
    if (page < 1 || (this.totalTripPages && page > this.totalTripPages)) return;
    this.tripsLoading = true;
    this.currentTripsPage = page;

    this.travellerService.getTravelPlansPage(page, this.tripPageLimit).subscribe({
      next: (res) => {
        this.myTrips = res.data;
        this.totalTrips = res.pagination.total;
        this.totalTripPages = res.pagination.totalPages;
        this.tripsLoading = false;
      },
      error: () => {
        this.myTrips = [];
        this.tripsLoading = false;
      },
    });
  }

  prevTripsPage() {
    this.loadTripsPage(this.currentTripsPage - 1);
  }

  nextTripsPage() {
    this.loadTripsPage(this.currentTripsPage + 1);
  }

  getStatusType(status: Parcel['status']): string {
    return parcelStatusBadge(status);
  }

  getTripStatusClass(status: string | undefined): string {
    switch (status) {
      case 'PLANNED':
      case 'ACTIVE':
      case 'scheduled': return 'chip-primary';
      case 'IN_TRANSIT':
      case 'in_transit': return 'chip-warning';
      case 'COMPLETED':
      case 'completed': return 'chip-success';
      case 'CANCELLED':
      case 'cancelled': return 'chip-error';
      default: return 'chip-primary';
    }
  }

  getTripStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'PLANNED':
        return 'Planned';
      case 'ACTIVE':
      case 'scheduled': return 'Active';
      case 'IN_TRANSIT':
      case 'in_transit': return 'In Transit';
      case 'COMPLETED':
      case 'completed': return 'Completed';
      case 'CANCELLED':
      case 'cancelled': return 'Cancelled';
      default: return 'Planned';
    }
  }

  getParcelStatusLabel(status: Parcel['status']): string {
    return parcelStatusLabel(status);
  }
}
