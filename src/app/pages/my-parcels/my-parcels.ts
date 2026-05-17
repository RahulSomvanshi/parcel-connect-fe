import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Parcel, ParcelService } from '../../core/services/parcel.service';
import {
  isOpenParcel,
  parcelStatusBadge,
  parcelStatusLabel,
} from '../../core/utils/parcel-status.util';

@Component({
  selector: 'app-my-parcels',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-parcels.html',
  styleUrl: './my-parcels.css',
})
export class MyParcels implements OnInit, OnDestroy {
  private parcelsSubject = new BehaviorSubject<Parcel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  parcels$ = this.parcelsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  activeFilter = 'all';
  filters = ['all', 'OPEN', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'REJECTED'];
  currentPage = 1;
  pageLimit = 5;
  totalPages = 0;
  totalParcels = 0;

  private destroy$ = new Subject<void>();

  constructor(private parcelService: ParcelService) {}


  ngOnInit() {
    this.loadParcels();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  getFilteredParcels(parcels: Parcel[]): Parcel[] {
    if (this.activeFilter === 'all') {
      return parcels;
    }
    if (this.activeFilter === 'OPEN') {
      return parcels.filter((parcel) => isOpenParcel(parcel.status));
    }
    return parcels.filter((parcel) => parcel.status === this.activeFilter);
  }

  getStatusType(status: string): string {
    return parcelStatusBadge(status);
  }

  getStatusDisplay(status: string): string {
    return parcelStatusLabel(status);
  }

  getTravellerName(traveller: Parcel['traveller']): string {
    if (!traveller) {
      return '';
    }
    return typeof traveller === 'string' ? traveller : traveller.fullName || '';
  }

  getTravellerPhone(traveller: Parcel['traveller']): string {
    if (!traveller || typeof traveller === 'string') {
      return '';
    }
    return traveller.phone || '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getProgress(status: string): number {
    switch (status) {
      case 'OPEN':
      case 'searching':
        return 10;
      case 'ACCEPTED':
      case 'matched':
        return 35;
      case 'PICKED_UP':
        return 50;
      case 'IN_TRANSIT':
      case 'in_transit':
        return 70;
      case 'DELIVERED':
      case 'delivered':
        return 100;
      case 'CANCELLED':
      case 'REJECTED':
        return 0;
      default: return 0;
    }
  }

  cancelParcel(parcelId: string) {
    if (confirm('Are you sure you want to delete this parcel?')) {
      this.parcelService.deleteParcel(parcelId).subscribe({
        next: () => this.loadParcels(),
        error: (err) =>
          this.errorSubject.next(err.error?.message || 'Failed to delete parcel'),
      });
    }
  }

  retryLoadParcels() {
    this.loadParcels();
  }

  loadParcels() {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.parcelService.getMyParcelsPage(this.currentPage, this.pageLimit).subscribe({
      next: (res) => {
        this.parcelsSubject.next(res.parcels);
        this.totalParcels = res.pagination?.total ?? res.total;
        this.totalPages = res.pagination?.totalPages ?? Math.ceil(this.totalParcels / this.pageLimit);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.parcelsSubject.next([]);
        this.errorSubject.next(err.error?.message || 'Failed to load parcels');
        this.loadingSubject.next(false);
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;
    this.currentPage = page;
    this.loadParcels();
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}
