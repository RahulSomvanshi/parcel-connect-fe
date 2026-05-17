import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Parcel } from '../../core/services/parcel.service';
import { TravellerService, TravelPlan } from '../../core/services/traveller.service';
import { parcelStatusLabel } from '../../core/utils/parcel-status.util';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-matching-parcels',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './matching-parcels.html',
  styleUrl: './matching-parcels.css',
})
export class MatchingParcels implements OnInit {
  parcels: Parcel[] = [];
  myTrips: TravelPlan[] = [];
  selectedTripId = '';
  selectedTrip: TravelPlan | null = null;
  tripsLoading = false;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageLimit = 5;
  totalPages = 0;
  totalParcels = 0;
  private requestId = 0;
  acceptingParcelId: string | null = null;

  constructor(
    private travellerService: TravellerService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.tripsLoading = true;
    this.loading = false;
    this.error = null;
    this.travellerService.getTravelPlans().subscribe({
      next: (trips) => {
        this.myTrips = trips.filter(
          (t) =>
            t.isAvailable !== false &&
            (!t.status ||
              t.status === 'scheduled' ||
              t.status === 'PLANNED' ||
              t.status === 'ACTIVE')
        );
        this.tripsLoading = false;
        if (this.myTrips.length) {
          this.selectedTripId = this.myTrips[0]._id!;
          this.onTripChange();
        } else {
          this.loading = false;
          this.parcels = [];
          this.totalParcels = 0;
          this.totalPages = 0;
          this.error = 'Add a travel plan first to see matching parcels.';
        }
      },
      error: () => {
        this.tripsLoading = false;
        this.loading = false;
        this.parcels = [];
        this.totalParcels = 0;
        this.totalPages = 0;
        this.error = 'Failed to load your trips.';
      },
    });
  }

  onTripChange() {
    this.selectedTrip = this.myTrips.find((t) => t._id === this.selectedTripId) || null;
    if (!this.selectedTripId) return;
    this.currentPage = 1;
    this.loadMatchingParcels();
  }

  loadMatchingParcels() {
    if (!this.selectedTripId) return;
    this.loading = true;
    this.error = null;

    const currentRequestId = ++this.requestId;
    this.travellerService.getMatchingParcelsPage(
      this.selectedTripId,
      this.currentPage,
      this.pageLimit
    ).subscribe({
      next: (res) => {
        if (currentRequestId !== this.requestId) return;
        this.parcels = res.data;
        this.totalParcels = res.pagination.total;
        this.totalPages = res.pagination.totalPages;
        this.loading = false;
        if (!res.data.length) {
          this.error = 'No matching parcels for this trip route yet.';
        }
      },
      error: (err) => {
        if (currentRequestId !== this.requestId) return;
        this.loading = false;
        this.error = err.error?.message || 'Failed to load matching parcels';
        this.parcels = [];
        this.totalParcels = 0;
        this.totalPages = 0;
      },
    });
  }

  acceptParcel(parcel: Parcel) {
    if (this.acceptingParcelId) return;
    if (parcel.isFlagged) {
      const ok = confirm(
        'Warning: This parcel may contain prohibited items. Accept only if you verified the contents. Continue?'
      );
      if (!ok) return;
    }

    this.acceptingParcelId = parcel._id!;
    this.travellerService.acceptParcelForTrip(this.selectedTripId, parcel._id!).subscribe({
      next: () => {
        this.toast.success('Parcel accepted');
        this.acceptingParcelId = null;
        this.loadMatchingParcels();
      },
      error: (err) =>
        {
          this.acceptingParcelId = null;
          this.toast.error(
            err.error?.message || 'Parcel already accepted by another traveller'
          );
        },
    });
  }

  rejectParcel(parcelId: string) {
    this.travellerService.respondToParcel(parcelId, 'reject').subscribe({
      next: () => {
        this.toast.info('Parcel rejected');
        this.loadMatchingParcels();
      },
      error: (err) => this.toast.error(err.error?.message || 'Could not reject parcel'),
    });
  }

  getStatusLabel(status: Parcel['status']): string {
    return parcelStatusLabel(status);
  }

  goToPage(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;
    this.currentPage = page;
    this.loadMatchingParcels();
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}
