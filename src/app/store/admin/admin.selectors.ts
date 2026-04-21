import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.reducer';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

// ── Users Selectors ──
export const selectUsers = createSelector(
  selectAdminState,
  (state: AdminState) => state.users
);

export const selectUsersPagination = createSelector(
  selectAdminState,
  (state: AdminState) => state.usersPagination
);

export const selectUsersLoading = createSelector(
  selectAdminState,
  (state: AdminState) => state.usersLoading
);

export const selectUsersError = createSelector(
  selectAdminState,
  (state: AdminState) => state.usersError
);

// ── Parcels Selectors ──
export const selectAdminParcels = createSelector(
  selectAdminState,
  (state: AdminState) => state.parcels
);

export const selectParcelsPagination = createSelector(
  selectAdminState,
  (state: AdminState) => state.parcelsPagination
);

export const selectParcelsLoading = createSelector(
  selectAdminState,
  (state: AdminState) => state.parcelsLoading
);

export const selectParcelsError = createSelector(
  selectAdminState,
  (state: AdminState) => state.parcelsError
);

// ── Computed Selectors ──
export const selectTotalUsers = createSelector(
  selectUsersPagination,
  (pagination) => pagination.total
);

export const selectTotalParcels = createSelector(
  selectParcelsPagination,
  (pagination) => pagination.total
);
