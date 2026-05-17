import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { TravellerService } from '../../core/services/traveller.service';
import { Parcel } from '../../core/services/parcel.service';
import { TravellerStats } from '../../core/services/stats.service';
import { formatInr, splitEarnings } from '../../core/utils/earnings.util';
import {
  canMarkDelivered,
  parcelStatusBadge,
  parcelStatusLabel,
} from '../../core/utils/parcel-status.util';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-my-deliveries',
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './my-deliveries.html',
  styleUrl: './my-deliveries.css',
})
export class MyDeliveries implements OnInit {
  private deliveriesSubject = new BehaviorSubject<Parcel[]>([]);
  deliveries$ = this.deliveriesSubject.asObservable();
  stats$: Observable<TravellerStats | null>;
  private refresh$ = new Subject<void>();
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageLimit = 5;
  totalPages = 0;
  totalDeliveries = 0;

  formatInr = formatInr;

  constructor(
    private travellerService: TravellerService,
    private toast: ToastService
  ) {
    this.stats$ = this.refresh$.pipe(
      startWith(void 0),
      switchMap(() => this.travellerService.getTravellerStats())
    );
  }

  ngOnInit() {
    this.loadDeliveries();
  }

  getParcelEarnings(price: number | undefined) {
    return splitEarnings(price || 0);
  }

  getStatusDisplay(status: Parcel['status']): string {
    return parcelStatusLabel(status);
  }

  getStatusType(status: Parcel['status']): string {
    return parcelStatusBadge(status);
  }

  updateParcelStatus(
    parcelId: string,
    status: 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED',
    successMessage: string
  ) {
    this.travellerService.updateAssignedParcelStatus(parcelId, status).subscribe({
      next: () => {
        this.toast.success(successMessage);
        this.loadDeliveries();
        this.refresh$.next();
      },
      error: (error) =>
        this.toast.error(error.error?.message || 'Failed to update delivery status'),
    });
  }

  deliverParcel(parcelId: string) {
    this.updateParcelStatus(parcelId, 'DELIVERED', 'Parcel marked as delivered');
  }

  markPickedUp(parcelId: string) {
    this.updateParcelStatus(parcelId, 'PICKED_UP', 'Parcel marked as picked up');
  }

  markInTransit(parcelId: string) {
    this.updateParcelStatus(parcelId, 'IN_TRANSIT', 'Parcel marked in transit');
  }

  markOutForDelivery(parcelId: string) {
    this.updateParcelStatus(
      parcelId,
      'OUT_FOR_DELIVERY',
      'Parcel marked out for delivery'
    );
  }

  canPickUp(status: Parcel['status']): boolean {
    return status === 'MATCHED' || status === 'ACCEPTED' || status === 'matched';
  }

  canMoveInTransit(status: Parcel['status']): boolean {
    return (
      status === 'PICKED_UP' ||
      status === 'MATCHED' ||
      status === 'ACCEPTED' ||
      status === 'matched' ||
      status === 'in_transit'
    );
  }

  canDeliver(status: Parcel['status']): boolean {
    return canMarkDelivered(status) || status === 'OUT_FOR_DELIVERY';
  }

  getDeliverButtonText(status: Parcel['status']): string {
    return status === 'DELIVERED' || status === 'delivered'
      ? 'Delivered'
      : 'Mark Delivered';
  }

  getSenderName(sender: Parcel['sender']): string {
    if (!sender) return 'Unknown';
    return typeof sender === 'string' ? sender : sender.fullName || 'Unknown';
  }

  getSenderPhone(sender: Parcel['sender']): string | null {
    if (!sender || typeof sender === 'string') return null;
    return sender.phone || null;
  }

  loadDeliveries() {
    this.loading = true;
    this.error = null;
    this.travellerService.getAssignedParcelsPage(this.currentPage, this.pageLimit).subscribe({
      next: (res) => {
        this.deliveriesSubject.next(res.data);
        this.totalDeliveries = res.pagination.total;
        this.totalPages = res.pagination.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.deliveriesSubject.next([]);
        this.error = err.error?.message || 'Failed to load deliveries';
        this.loading = false;
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;
    this.currentPage = page;
    this.loadDeliveries();
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}
