import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminService } from '../../core/services/admin.service';
import * as AdminActions from './admin.actions';

@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private adminService = inject(AdminService);

  // Load Users Effect
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadUsers),
      mergeMap((action) =>
        this.adminService.getAllUsers(action.page, action.limit).pipe(
          map((response) =>
            AdminActions.loadUsersSuccess({
              users: response.data,
              pagination: response.pagination,
            })
          ),
          catchError((error) =>
            of(
              AdminActions.loadUsersFailure({
                error: error.error?.message || error.message || 'Failed to load users',
              })
            )
          )
        )
      )
    )
  );

  // Load Parcels Effect
  loadAdminParcels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminParcels),
      mergeMap((action) =>
        this.adminService.getAllParcels(action.page, action.limit).pipe(
          map((response) =>
            AdminActions.loadAdminParcelsSuccess({
              parcels: response.data,
              pagination: response.pagination,
            })
          ),
          catchError((error) =>
            of(
              AdminActions.loadAdminParcelsFailure({
                error: error.error?.message || error.message || 'Failed to load parcels',
              })
            )
          )
        )
      )
    )
  );
}
