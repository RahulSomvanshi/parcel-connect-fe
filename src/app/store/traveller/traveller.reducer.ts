import { createReducer, on } from '@ngrx/store';
import { TravelPlan } from '../../core/services/traveller.service';
import { Parcel } from '../../core/services/parcel.service';
import * as TravellerActions from './traveller.actions';

export interface TravellerState {
  travelPlans: TravelPlan[];
  matchingParcels: Parcel[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadingMatching: boolean;
}

export const initialState: TravellerState = {
  travelPlans: [],
  matchingParcels: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  loadingMatching: false,
};

export const travellerReducer = createReducer(
  initialState,

  // ── Load ──
  on(TravellerActions.loadTravelPlans, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TravellerActions.loadTravelPlansSuccess, (state, { travelPlans }) => ({
    ...state,
    travelPlans,
    loading: false,
    error: null,
  })),
  on(TravellerActions.loadTravelPlansFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create ──
  on(TravellerActions.createTravelPlan, (state) => ({
    ...state,
    creating: true,
    error: null,
  })),
  on(TravellerActions.createTravelPlanSuccess, (state, { travelPlan }) => ({
    ...state,
    travelPlans: [travelPlan, ...state.travelPlans],
    creating: false,
    error: null,
  })),
  on(TravellerActions.createTravelPlanFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error,
  })),

  // ── Update ──
  on(TravellerActions.updateTravelPlan, (state) => ({
    ...state,
    updating: true,
    error: null,
  })),
  on(TravellerActions.updateTravelPlanSuccess, (state, { travelPlan }) => ({
    ...state,
    travelPlans: state.travelPlans.map((tp) =>
      tp._id === travelPlan._id ? travelPlan : tp
    ),
    updating: false,
    error: null,
  })),
  on(TravellerActions.updateTravelPlanFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error,
  })),

  // ── Delete ──
  on(TravellerActions.deleteTravelPlan, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(TravellerActions.deleteTravelPlanSuccess, (state, { id }) => ({
    ...state,
    travelPlans: state.travelPlans.filter((tp) => tp._id !== id),
    deleting: false,
    error: null,
  })),
  on(TravellerActions.deleteTravelPlanFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // ── Load Matching Parcels ──
  on(TravellerActions.loadMatchingParcels, (state) => ({
    ...state,
    loadingMatching: true,
    error: null,
  })),
  on(TravellerActions.loadMatchingParcelsSuccess, (state, { parcels }) => ({
    ...state,
    matchingParcels: parcels,
    loadingMatching: false,
    error: null,
  })),
  on(TravellerActions.loadMatchingParcelsFailure, (state, { error }) => ({
    ...state,
    loadingMatching: false,
    error,
  })),

  // ── Clear ──
  on(TravellerActions.clearTravellerState, () => initialState)
);
