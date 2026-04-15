import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TravellerService } from '../../core/services/traveller.service';
import { Parcel } from '../../core/services/parcel.service';

@Component({
  selector: 'app-traveller-dashboard',
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './traveller-dashboard.html',
  styleUrl: './traveller-dashboard.css',
})
export class TravellerDashboard implements OnInit {
  deliveries$: Observable<Parcel[]>;

  suggestedMatch = {
    title: 'Handcrafted Decor',
    payout: '₹3,200',
    route: 'Mumbai → London',
    requests: 8,
  };

  constructor(private travellerService: TravellerService) {
    this.deliveries$ = this.travellerService.getAssignedParcels();
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

  getSenderName(sender: Parcel['sender']): string {
    if (!sender) {
      return 'Unknown';
    }
    return typeof sender === 'string' ? sender : sender.fullName || 'Unknown';
  }
}
