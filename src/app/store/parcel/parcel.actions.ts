import { createAction, props } from '@ngrx/store';
import { Parcel, CreateParcelRequest } from '../../core/services/parcel.service';

// Load Parcels
export const loadParcels = createAction('[Parcel] Load Parcels');
export const loadParcelsSuccess = createAction(
  '[Parcel] Load Parcels Success',
  props<{ parcels: Parcel[] }>()
);
export const loadParcelsFailure = createAction(
  '[Parcel] Load Parcels Failure',
  props<{ error: string }>()
);

// Create Parcel
export const createParcel = createAction(
  '[Parcel] Create Parcel',
  props<{ parcelData: CreateParcelRequest }>()
);
export const createParcelSuccess = createAction(
  '[Parcel] Create Parcel Success',
  props<{ parcel: Parcel }>()
);
export const createParcelFailure = createAction(
  '[Parcel] Create Parcel Failure',
  props<{ error: string }>()
);

// Update Parcel Status
export const updateParcelStatus = createAction(
  '[Parcel] Update Parcel Status',
  props<{ id: string; status: Parcel['status'] }>()
);
export const updateParcelStatusSuccess = createAction(
  '[Parcel] Update Parcel Status Success',
  props<{ parcel: Parcel }>()
);
export const updateParcelStatusFailure = createAction(
  '[Parcel] Update Parcel Status Failure',
  props<{ error: string }>()
);

// Delete Parcel
export const deleteParcel = createAction(
  '[Parcel] Delete Parcel',
  props<{ id: string }>()
);
export const deleteParcelSuccess = createAction(
  '[Parcel] Delete Parcel Success',
  props<{ id: string }>()
);
export const deleteParcelFailure = createAction(
  '[Parcel] Delete Parcel Failure',
  props<{ error: string }>()
);

// Clear Parcel State
export const clearParcelState = createAction('[Parcel] Clear Parcel State');

// Export all actions
export const ParcelActions = {
  loadParcels,
  loadParcelsSuccess,
  loadParcelsFailure,
  createParcel,
  createParcelSuccess,
  createParcelFailure,
  updateParcelStatus,
  updateParcelStatusSuccess,
  updateParcelStatusFailure,
  deleteParcel,
  deleteParcelSuccess,
  deleteParcelFailure,
  clearParcelState,
};