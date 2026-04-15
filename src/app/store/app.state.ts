import { ActionReducerMap } from '@ngrx/store';
import { parcelReducer, ParcelState } from './parcel/parcel.reducer';
import { travellerReducer, TravellerState } from './traveller/traveller.reducer';

export interface AppState {
  parcel: ParcelState;
  traveller: TravellerState;
}

export const reducers: ActionReducerMap<AppState> = {
  parcel: parcelReducer,
  traveller: travellerReducer,
};