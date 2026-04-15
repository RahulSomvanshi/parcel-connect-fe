import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ParcelService } from '../../core/services/parcel.service';
import * as ParcelActions from './parcel.actions';

@Injectable()
export class ParcelEffects {
  private actions$ = inject(Actions);
  private parcelService = inject(ParcelService);
  private router = inject(Router);

  // Load Parcels Effect
  loadParcels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParcelActions.loadParcels),
      mergeMap(() =>
        this.parcelService.getParcels().pipe(
          map((parcels) => ParcelActions.loadParcelsSuccess({ parcels })),
          catchError((error) =>
            of(ParcelActions.loadParcelsFailure({ error: error.message || 'Failed to load parcels' }))
          )
        )
      )
    )
  );

  // Create Parcel Effect
  createParcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParcelActions.createParcel),
      mergeMap((action) =>
        this.parcelService.createParcel(action.parcelData).pipe(
          map((parcel) => ParcelActions.createParcelSuccess({ parcel })),
          catchError((error) =>
            of(ParcelActions.createParcelFailure({ error: error.message || 'Failed to create parcel' }))
          )
        )
      )
    )
  );

  // Navigate after successful parcel creation
  createParcelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParcelActions.createParcelSuccess),
      tap(() => {
        this.router.navigate(['/dashboard/my-parcels']);
      })
    ),
    { dispatch: false }
  );

  // Update Parcel Status Effect
  updateParcelStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParcelActions.updateParcelStatus),
      mergeMap((action) =>
        this.parcelService.updateParcelStatus(action.id, action.status).pipe(
          map((parcel) => ParcelActions.updateParcelStatusSuccess({ parcel })),
          catchError((error) =>
            of(ParcelActions.updateParcelStatusFailure({ error: error.message || 'Failed to update parcel status' }))
          )
        )
      )
    )
  );

  // Delete Parcel Effect
  deleteParcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParcelActions.deleteParcel),
      mergeMap((action) =>
        this.parcelService.deleteParcel(action.id).pipe(
          map(() => ParcelActions.deleteParcelSuccess({ id: action.id })),
          catchError((error) =>
            of(ParcelActions.deleteParcelFailure({ error: error.message || 'Failed to delete parcel' }))
          )
        )
      )
    )
  );
}