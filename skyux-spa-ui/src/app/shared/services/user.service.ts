import {
  Location
} from '@angular/common';
import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs';
import {
  filter,
  map,
  shareReplay
} from 'rxjs/operators';
import {
  User
} from '../models';
import { BaseService } from './base.service';

@Injectable()
export class UserService extends BaseService {
  private user: Observable<User> | undefined;

  constructor(
    private location: Location,
    httpClient: HttpClient
  ) {
    super(httpClient);
  }

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
          `${this.bffUrl}auth/user`,
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
    return this.bffUrl
      + `auth/${action}?redirect=`
      + window.location.href.replace(this.location.path(), '')
      + (route ? route : '');
  }
}
