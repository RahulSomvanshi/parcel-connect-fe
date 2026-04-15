import { createAction, props } from '@ngrx/store';
import { TravelPlan, CreateTravelPlanRequest } from '../../core/services/traveller.service';
import { Parcel } from '../../core/services/parcel.service';

// ── Load Travel Plans ──
export const loadTravelPlans = createAction('[Traveller] Load Travel Plans');
export const loadTravelPlansSuccess = createAction(
  '[Traveller] Load Travel Plans Success',
  props<{ travelPlans: TravelPlan[] }>()
);
export const loadTravelPlansFailure = createAction(
  '[Traveller] Load Travel Plans Failure',
  props<{ error: string }>()
);

// ── Create Travel Plan ──
export const createTravelPlan = createAction(
  '[Traveller] Create Travel Plan',
  props<{ travelPlanData: CreateTravelPlanRequest }>()
);
export const createTravelPlanSuccess = createAction(
  '[Traveller] Create Travel Plan Success',
  props<{ travelPlan: TravelPlan }>()
);
export const createTravelPlanFailure = createAction(
  '[Traveller] Create Travel Plan Failure',
  props<{ error: string }>()
);

// ── Update Travel Plan ──
export const updateTravelPlan = createAction(
  '[Traveller] Update Travel Plan',
  props<{ id: string; data: Partial<CreateTravelPlanRequest> }>()
);
export const updateTravelPlanSuccess = createAction(
  '[Traveller] Update Travel Plan Success',
  props<{ travelPlan: TravelPlan }>()
);
export const updateTravelPlanFailure = createAction(
  '[Traveller] Update Travel Plan Failure',
  props<{ error: string }>()
);

// ── Delete Travel Plan ──
export const deleteTravelPlan = createAction(
  '[Traveller] Delete Travel Plan',
  props<{ id: string }>()
);
export const deleteTravelPlanSuccess = createAction(
  '[Traveller] Delete Travel Plan Success',
  props<{ id: string }>()
);
export const deleteTravelPlanFailure = createAction(
  '[Traveller] Delete Travel Plan Failure',
  props<{ error: string }>()
);

// ── Load Matching Parcels ──
export const loadMatchingParcels = createAction('[Traveller] Load Matching Parcels');
export const loadMatchingParcelsSuccess = createAction(
  '[Traveller] Load Matching Parcels Success',
  props<{ parcels: Parcel[] }>()
);
export const loadMatchingParcelsFailure = createAction(
  '[Traveller] Load Matching Parcels Failure',
  props<{ error: string }>()
);

// ── Clear State ──
export const clearTravellerState = createAction('[Traveller] Clear State');
