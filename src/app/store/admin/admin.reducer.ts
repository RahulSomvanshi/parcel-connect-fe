import { createReducer, on } from '@ngrx/store';
import { AdminUser, AdminParcel, PaginationInfo } from '../../core/services/admin.service';
import * as AdminActions from './admin.actions';

export interface AdminState {
  users: AdminUser[];
  usersPagination: PaginationInfo;
  usersLoading: boolean;
  usersError: string | null;

  parcels: AdminParcel[];
  parcelsPagination: PaginationInfo;
  parcelsLoading: boolean;
  parcelsError: string | null;
}

export const initialState: AdminState = {
  users: [],
  usersPagination: { total: 0, page: 1, limit: 5, totalPages: 0 },
  usersLoading: false,
  usersError: null,

  parcels: [],
  parcelsPagination: { total: 0, page: 1, limit: 5, totalPages: 0 },
  parcelsLoading: false,
  parcelsError: null,
};

export const adminReducer = createReducer(
  initialState,

  // ── Load Users ──
  on(AdminActions.loadUsers, (state) => ({
    ...state,
    usersLoading: true,
    usersError: null,
  })),
  on(AdminActions.loadUsersSuccess, (state, { users, pagination }) => ({
    ...state,
    users,
    usersPagination: pagination,
    usersLoading: false,
    usersError: null,
  })),
  on(AdminActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    usersLoading: false,
    usersError: error,
  })),

  // ── Load Parcels ──
  on(AdminActions.loadAdminParcels, (state) => ({
    ...state,
    parcelsLoading: true,
    parcelsError: null,
  })),
  on(AdminActions.loadAdminParcelsSuccess, (state, { parcels, pagination }) => ({
    ...state,
    parcels,
    parcelsPagination: pagination,
    parcelsLoading: false,
    parcelsError: null,
  })),
  on(AdminActions.loadAdminParcelsFailure, (state, { error }) => ({
    ...state,
    parcelsLoading: false,
    parcelsError: error,
  })),

  // ── Clear State ──
  on(AdminActions.clearAdminState, () => initialState)
);
