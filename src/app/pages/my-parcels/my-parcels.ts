import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Parcel } from '../../core/services/parcel.service';
import { ParcelActions } from '../../store/parcel/parcel.actions';
import * as ParcelSelectors from '../../store/parcel/parcel.selectors';

@Component({
  selector: 'app-my-parcels',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-parcels.html',
  styleUrl: './my-parcels.css',
})
export class MyParcels implements OnInit, OnDestroy {
  parcels$: Observable<Parcel[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  activeFilter = 'all';
  filters = ['all', 'searching', 'matched', 'in_transit', 'delivered'];

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.parcels$ = this.store.select(ParcelSelectors.selectParcels);
    this.loading$ = this.store.select(ParcelSelectors.selectLoading);
    this.error$ = this.store.select(ParcelSelectors.selectError);
  }


  ngOnInit() {
    this.store.dispatch(ParcelActions.loadParcels());
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
    return parcels.filter(parcel => parcel.status === this.activeFilter);
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
      case 'searching': return 10;
      case 'matched': return 35;
      case 'in_transit': return 65;
      case 'delivered': return 100;
      default: return 0;
    }
  }

  cancelParcel(parcelId: string) {
    if (confirm('Are you sure you want to delete this parcel?')) {
      this.store.dispatch(ParcelActions.deleteParcel({ id: parcelId }));
    }
  }

  retryLoadParcels() {
    this.store.dispatch(ParcelActions.loadParcels());
  }
}
