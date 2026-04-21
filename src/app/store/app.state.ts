import { ActionReducerMap } from '@ngrx/store';
import { parcelReducer, ParcelState } from './parcel/parcel.reducer';
import { travellerReducer, TravellerState } from './traveller/traveller.reducer';
import { adminReducer, AdminState } from './admin/admin.reducer';

export interface AppState {
  parcel: ParcelState;
  traveller: TravellerState;
  admin: AdminState;
}

export const reducers: ActionReducerMap<AppState> = {
  parcel: parcelReducer,
  traveller: travellerReducer,
  admin: adminReducer,
};