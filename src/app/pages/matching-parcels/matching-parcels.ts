import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Parcel } from '../../core/services/parcel.service';
import { TravellerService } from '../../core/services/traveller.service';
import { loadMatchingParcels } from '../../store/traveller/traveller.actions';
import { selectMatchingParcels } from '../../store/traveller/traveller.selectors';

@Component({
  selector: 'app-matching-parcels',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './matching-parcels.html',
  styleUrl: './matching-parcels.css',
})
export class MatchingParcels implements OnInit {
  parcels$: Observable<Parcel[]>;

  constructor(private store: Store, private travellerService: TravellerService) {
    this.parcels$ = this.store.select(selectMatchingParcels);
  }

  ngOnInit() {
    this.store.dispatch(loadMatchingParcels());
  }

  acceptParcel(parcelId: string) {
    this.travellerService.respondToParcel(parcelId, 'accept').subscribe({
      next: (response) => {
        console.log('Parcel accepted:', response);
        // Reload matching parcels
        this.store.dispatch(loadMatchingParcels());
      },
      error: (error) => {
        console.error('Error accepting parcel:', error);
      }
    });
  }

  declineParcel(parcelId: string) {
    this.travellerService.respondToParcel(parcelId, 'decline').subscribe({
      next: (response) => {
        console.log('Parcel declined:', response);
        // Reload matching parcels
        this.store.dispatch(loadMatchingParcels());
      },
      error: (error) => {
        console.error('Error declining parcel:', error);
      }
    });
  }
}
