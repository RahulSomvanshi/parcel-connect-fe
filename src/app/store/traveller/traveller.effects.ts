import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TravellerService } from '../../core/services/traveller.service';
import * as TravellerActions from './traveller.actions';

@Injectable()
export class TravellerEffects {
  private actions$ = inject(Actions);
  private travellerService = inject(TravellerService);
  private router = inject(Router);

  // ── Load Travel Plans ──
  loadTravelPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TravellerActions.loadTravelPlans),
      mergeMap(() =>
        this.travellerService.getTravelPlans().pipe(
          map((travelPlans) =>
            TravellerActions.loadTravelPlansSuccess({ travelPlans })
          ),
          catchError((error) =>
            of(
              TravellerActions.loadTravelPlansFailure({
                error: error.message || 'Failed to load travel plans',
              })
            )
          )
        )
      )
    )
  );

  // ── Create Travel Plan ──
  createTravelPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TravellerActions.createTravelPlan),
      mergeMap((action) =>
        this.travellerService.createTravelPlan(action.travelPlanData).pipe(
          map((travelPlan) =>
            TravellerActions.createTravelPlanSuccess({ travelPlan })
          ),
          catchError((error) =>
            of(
              TravellerActions.createTravelPlanFailure({
                error: error.message || 'Failed to create travel plan',
              })
            )
          )
        )
      )
    )
  );

  // ── Navigate after successful creation ──
  createTravelPlanSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TravellerActions.createTravelPlanSuccess),
        tap(() => {
          this.router.navigate(['/dashboard/traveller']);
        })
      ),
    { dispatch: false }
  );

  // ── Update Travel Plan ──
  updateTravelPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TravellerActions.updateTravelPlan),
      mergeMap((action) =>
        this.travellerService.updateTravelPlan(action.id, action.data).pipe(
          map((travelPlan) =>
            TravellerActions.updateTravelPlanSuccess({ travelPlan })
          ),
          catchError((error) =>
            of(
              TravellerActions.updateTravelPlanFailure({
                error: error.message || 'Failed to update travel plan',
              })
            )
          )
        )
      )
    )
  );

  // ── Delete Travel Plan ──
  deleteTravelPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TravellerActions.deleteTravelPlan),
      mergeMap((action) =>
        this.travellerService.deleteTravelPlan(action.id).pipe(
          map(() =>
            TravellerActions.deleteTravelPlanSuccess({ id: action.id })
          ),
          catchError((error) =>
            of(
              TravellerActions.deleteTravelPlanFailure({
                error: error.message || 'Failed to delete travel plan',
              })
            )
          )
        )
      )
    )
  );

  // ── Load Matching Parcels ──
  loadMatchingParcels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TravellerActions.loadMatchingParcels),
      mergeMap(() =>
        this.travellerService.getMatchingParcels().pipe(
          map((parcels) =>
            TravellerActions.loadMatchingParcelsSuccess({ parcels })
          ),
          catchError((error) =>
            of(
              TravellerActions.loadMatchingParcelsFailure({
                error: error.message || 'Failed to load matching parcels',
              })
            )
          )
        )
      )
    )
  );
}
