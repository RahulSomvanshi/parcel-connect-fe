import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParcelState } from './parcel.reducer';

export const selectParcelState = createFeatureSelector<ParcelState>('parcel');

export const selectParcels = createSelector(
  selectParcelState,
  (state: ParcelState) => state.parcels
);

export const selectLoading = createSelector(
  selectParcelState,
  (state: ParcelState) => state.loading
);

export const selectCreating = createSelector(
  selectParcelState,
  (state: ParcelState) => state.creating
);

export const selectUpdating = createSelector(
  selectParcelState,
  (state: ParcelState) => state.updating
);

export const selectDeleting = createSelector(
  selectParcelState,
  (state: ParcelState) => state.deleting
);

export const selectError = createSelector(
  selectParcelState,
  (state: ParcelState) => state.error
);

// Filtered selectors (matching backend status values)
export const selectSearchingParcels = createSelector(
  selectParcels,
  (parcels) => parcels.filter((parcel) => parcel.status === 'searching')
);

export const selectMatchedParcels = createSelector(
  selectParcels,
  (parcels) => parcels.filter((parcel) => parcel.status === 'matched')
);

export const selectInTransitParcels = createSelector(
  selectParcels,
  (parcels) => parcels.filter((parcel) => parcel.status === 'in_transit')
);

export const selectDeliveredParcels = createSelector(
  selectParcels,
  (parcels) => parcels.filter((parcel) => parcel.status === 'delivered')
);

export const selectParcelById = (id: string) =>
  createSelector(selectParcels, (parcels) => parcels.find((parcel) => parcel._id === id));