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

const hasStatus = (parcel: { status: string }, statuses: string[]) =>
  statuses.includes(parcel.status);

export const selectSearchingParcels = createSelector(selectParcels, (parcels) =>
  parcels.filter((p) => hasStatus(p, ['PENDING', 'OPEN', 'searching']))
);

export const selectMatchedParcels = createSelector(selectParcels, (parcels) =>
  parcels.filter((p) => hasStatus(p, ['MATCHED', 'ACCEPTED', 'matched']))
);

export const selectInTransitParcels = createSelector(selectParcels, (parcels) =>
  parcels.filter((p) => hasStatus(p, ['IN_TRANSIT', 'PICKED_UP', 'in_transit']))
);

export const selectDeliveredParcels = createSelector(selectParcels, (parcels) =>
  parcels.filter((p) => hasStatus(p, ['DELIVERED', 'delivered']))
);

export const selectParcelById = (id: string) =>
  createSelector(selectParcels, (parcels) => parcels.find((parcel) => parcel._id === id));