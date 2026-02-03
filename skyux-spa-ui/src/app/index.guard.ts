import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Params,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import {
  Observable,
  of
} from 'rxjs';
import {
  catchError,
  finalize,
  tap
} from 'rxjs/operators';
import {
  UserService
} from './shared/services';

@Injectable()
export class AppRouteGuard {
  router = inject(Router);
  private userService = inject(UserService);


  private authRoute = '/auth';
  private protectedRoutes = [
    '/dogs'
  ];

  public canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // always allow nagivation to the error page
    if (state.url.startsWith('/error')) {
      return of(true);
    }

    if (!this.protectedRoutes
      .some(protectedRoute => state.url
        .startsWith(protectedRoute)
      )
  ) {
    return of(true);
  }

    const queryParams: Params = {};

    // Preserve error passed from backend
    const requestedUrlParts = state.url.split('?error=');

    // Add back real url regardless
    queryParams['route'] = requestedUrlParts[0];

    // Add back error if it exists
    if (requestedUrlParts.length === 2) {
      queryParams['error'] = requestedUrlParts[1];
    }

    return new Observable((obs) => {
      this.userService
      .isUserAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router
              .navigate(
                [this.authRoute],
                {
                  queryParams
                }
              );
          } else {
            obs.next(true);
          }
        }),
        finalize(() => obs.complete()),
        catchError(() => {
          return of(false);
        })
      );
    });
  }
}
