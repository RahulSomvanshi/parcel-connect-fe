import { createReducer, on } from '@ngrx/store';
import { Parcel } from '../../core/services/parcel.service';
import * as ParcelActions from './parcel.actions';

export interface ParcelState {
  parcels: Parcel[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export const initialState: ParcelState = {
  parcels: [],
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
};

export const parcelReducer = createReducer(
  initialState,

  // Load Parcels
  on(ParcelActions.loadParcels, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ParcelActions.loadParcelsSuccess, (state, { parcels }) => ({
    ...state,
    parcels,
    loading: false,
    error: null,
  })),
  on(ParcelActions.loadParcelsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Parcel
  on(ParcelActions.createParcel, (state) => ({
    ...state,
    creating: true,
    error: null,
  })),
  on(ParcelActions.createParcelSuccess, (state, { parcel }) => ({
    ...state,
    parcels: [parcel, ...state.parcels],
    creating: false,
    error: null,
  })),
  on(ParcelActions.createParcelFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error,
  })),

  // Update Parcel Status
  on(ParcelActions.updateParcelStatus, (state) => ({
    ...state,
    updating: true,
    error: null,
  })),
  on(ParcelActions.updateParcelStatusSuccess, (state, { parcel }) => ({
    ...state,
    parcels: state.parcels.map((p) => (p._id === parcel._id ? parcel : p)),
    updating: false,
    error: null,
  })),
  on(ParcelActions.updateParcelStatusFailure, (state, { error }) => ({
    ...state,
    updating: false,
    error,
  })),

  // Delete Parcel
  on(ParcelActions.deleteParcel, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(ParcelActions.deleteParcelSuccess, (state, { id }) => ({
    ...state,
    parcels: state.parcels.filter((p) => p._id !== id),
    deleting: false,
    error: null,
  })),
  on(ParcelActions.deleteParcelFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),

  // Clear State
  on(ParcelActions.clearParcelState, () => initialState)
);