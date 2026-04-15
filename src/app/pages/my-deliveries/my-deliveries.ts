import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { TravellerService } from '../../core/services/traveller.service';
import { Parcel } from '../../core/services/parcel.service';

@Component({
  selector: 'app-my-deliveries',
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './my-deliveries.html',
  styleUrl: './my-deliveries.css',
})
export class MyDeliveries implements OnInit {
  deliveries$: Observable<Parcel[]>;
  private refresh$ = new Subject<void>();

  constructor(private travellerService: TravellerService) {
    this.deliveries$ = this.refresh$.pipe(
      startWith(void 0),
      switchMap(() => this.travellerService.getAssignedParcels())
    );
  }

  ngOnInit() {
    // Data is loaded via the observable
  }

  getStatusType(status: Parcel['status']): string {
    switch (status) {
      case 'searching': return 'secondary';
      case 'matched': return 'primary';
      case 'in_transit': return 'warning';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  }

  deliverParcel(parcelId: string) {
    this.travellerService.respondToParcel(parcelId, 'deliver').subscribe({
      next: () => {
        this.refresh$.next();
      },
      error: (error) => {
        console.error('Failed to mark parcel delivered', error);
      }
    });
  }

  canDeliver(status: Parcel['status']): boolean {
    return status === 'matched' || status === 'in_transit';
  }

  getDeliverButtonText(status: Parcel['status']): string {
    if (status === 'delivered') {
      return 'Delivered';
    }
    return 'Deliver';
  }

  getSenderName(sender: Parcel['sender']): string {
    if (!sender) {
      return 'Unknown';
    }
    return typeof sender === 'string' ? sender : sender.fullName || 'Unknown';
  }

  getSenderPhone(sender: Parcel['sender']): string | null {
    if (!sender || typeof sender === 'string') {
      return null;
    }
    return sender.phone || null;
  }
}
