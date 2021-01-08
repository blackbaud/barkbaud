import {
  Injectable
} from '@angular/core';

import {
  Location
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  filter,
  map,
  shareReplay
} from 'rxjs/operators';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  User
} from '../models';

@Injectable()
export class UserService {
  private user: Observable<User>;

  constructor(
    private location: Location,
    private httpClient: HttpClient,
    private skyAppConfig: SkyAppConfig
  ) { }

  public getLoginUri(route?: string): string {
    return this.getAuthUri('login', route);
  }

  public getLogoutUri(): string {
    return this.getAuthUri('logout');
  }

  // Only fires once we have an authenticated user
  public getAuthenticatedUser(): Observable<User> {
    return this.getUser()
      .pipe(
        filter(user => user.authenticated)
      );
  }

  public isUserAuthenticated(): Observable<boolean> {
    return this.getUser()
      .pipe(
        map(user => user.authenticated)
      );
  }

  private getUser(): Observable<User> {
    if (!this.user) {
      this.user = this.httpClient
        .get<User>(
          `${this.skyAppConfig.skyux.appSettings.bffUrl}auth/user`,
          {
            withCredentials: true
          }
        )
        .pipe(
          shareReplay(1)
        );
    }

    return this.user;
  }

  private getAuthUri(
    action: string,
    route?: string
  ): string {
    return this.skyAppConfig.skyux.appSettings.bffUrl
      + `auth/${action}?redirect=`
      + window.location.href.replace(this.location.path(), '')
      + (route ? route : '');
  }
}
