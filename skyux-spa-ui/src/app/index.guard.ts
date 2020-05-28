import {
  Injectable
} from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Params,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import {
  Observable
} from 'rxjs';

import {
  tap
} from 'rxjs/operators';

import {
  UserService
} from './shared/services';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {

  private authRoute = '/auth';
  private protectedRoutes = [
    '/dogs'
  ];

  constructor (
    public router: Router,
    private userService: UserService
  ) { }

  public canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this._canActivate(state);
  }

  public canActivateChild (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this._canActivate(state);
  }

  private _canActivate (
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    if (!this.protectedRoutes
        .some(protectedRoute => state.url
          .startsWith(protectedRoute)
        )
    ) {
      return true;
    }

    const queryParams: Params = {};

    // Preserve error passed from backend
    const requestedUrlParts = state.url.split('?error=');

    // Add back real url regardless
    queryParams.route = requestedUrlParts[0];

    // Add back error if it exists
    if (requestedUrlParts.length === 2) {
      queryParams.error = requestedUrlParts[1];
    }

    return this.userService
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
          }
        })
      );
  }
}
