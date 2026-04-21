import { createAction, props } from '@ngrx/store';
import {
  AdminUser,
  AdminParcel,
  PaginationInfo,
} from '../../core/services/admin.service';

// ── Load Users ──
export const loadUsers = createAction(
  '[Admin] Load Users',
  props<{ page: number; limit: number }>()
);
export const loadUsersSuccess = createAction(
  '[Admin] Load Users Success',
  props<{ users: AdminUser[]; pagination: PaginationInfo }>()
);
export const loadUsersFailure = createAction(
  '[Admin] Load Users Failure',
  props<{ error: string }>()
);

// ── Load Parcels ──
export const loadAdminParcels = createAction(
  '[Admin] Load Parcels',
  props<{ page: number; limit: number }>()
);
export const loadAdminParcelsSuccess = createAction(
  '[Admin] Load Parcels Success',
  props<{ parcels: AdminParcel[]; pagination: PaginationInfo }>()
);
export const loadAdminParcelsFailure = createAction(
  '[Admin] Load Parcels Failure',
  props<{ error: string }>()
);

// ── Clear State ──
export const clearAdminState = createAction('[Admin] Clear State');

// Export all actions
export const AdminActions = {
  loadUsers,
  loadUsersSuccess,
  loadUsersFailure,
  loadAdminParcels,
  loadAdminParcelsSuccess,
  loadAdminParcelsFailure,
  clearAdminState,
};
