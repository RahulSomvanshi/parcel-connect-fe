import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Parcel } from '../../core/services/parcel.service';
import * as ParcelActions from '../../store/parcel/parcel.actions';
import * as ParcelSelectors from '../../store/parcel/parcel.selectors';

@Component({
  selector: 'app-sender-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './sender-dashboard.html',
  styleUrl: './sender-dashboard.css',
})
export class SenderDashboard implements OnInit, OnDestroy {
  parcels$: Observable<Parcel[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  // Statistics
  stats$!: Observable<{
    totalParcels: number;
    searchingParcels: number;
    inTransitParcels: number;
    deliveredParcels: number;
    totalSpent: number;
  }>;

  recentParcels$!: Observable<Parcel[]>;

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.parcels$ = this.store.select(ParcelSelectors.selectParcels);
    this.loading$ = this.store.select(ParcelSelectors.selectLoading);
    this.error$ = this.store.select(ParcelSelectors.selectError);
  }

  ngOnInit() {
    this.store.dispatch(ParcelActions.loadParcels());

    // Create statistics observable
    this.stats$ = combineLatest([
      this.store.select(ParcelSelectors.selectParcels),
      this.store.select(ParcelSelectors.selectSearchingParcels),
      this.store.select(ParcelSelectors.selectInTransitParcels),
      this.store.select(ParcelSelectors.selectDeliveredParcels)
    ]).pipe(
      map(([allParcels, searching, inTransit, delivered]) => ({
        totalParcels: allParcels.length,
        searchingParcels: searching.length,
        inTransitParcels: inTransit.length,
        deliveredParcels: delivered.length,
        totalSpent: allParcels.reduce((sum, parcel) => sum + (parcel.price || 0), 0)
      }))
    );

    // Get recent parcels (last 5)
    this.recentParcels$ = this.parcels$.pipe(
      map(parcels => parcels.slice(0, 5))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
