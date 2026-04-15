import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TravellerState } from './traveller.reducer';

export const selectTravellerState =
  createFeatureSelector<TravellerState>('traveller');

export const selectTravelPlans = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.travelPlans
);

export const selectTravellerLoading = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.loading
);

export const selectTravellerCreating = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.creating
);

export const selectTravellerUpdating = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.updating
);

export const selectTravellerDeleting = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.deleting
);

export const selectMatchingParcels = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.matchingParcels
);

export const selectTravellerError = createSelector(
  selectTravellerState,
  (state: TravellerState) => state.error
);

// ── Filtered Selectors ──
export const selectAvailableTravelPlans = createSelector(
  selectTravelPlans,
  (plans) => plans.filter((plan) => plan.isAvailable === true)
);

export const selectUnavailableTravelPlans = createSelector(
  selectTravelPlans,
  (plans) => plans.filter((plan) => plan.isAvailable === false)
);

export const selectTravelPlansByVehicle = (vehicleType: 'bus' | 'train' | 'car') =>
  createSelector(selectTravelPlans, (plans) =>
    plans.filter((plan) => plan.vehicleType === vehicleType)
  );

export const selectTravelPlanById = (id: string) =>
  createSelector(selectTravelPlans, (plans) =>
    plans.find((plan) => plan._id === id)
  );
