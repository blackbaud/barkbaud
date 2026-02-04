import { Component, inject } from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  UserService
} from '../shared/services';

import {
  User
} from '../shared/models/user.model';

import { SkyErrorModule } from '@skyux/errors';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    imports: [SkyErrorModule, SkyAppResourcesPipe]
})
export class AuthComponent {
  public loginUri: string;

  public user: User;

  constructor() {
    const route = inject(ActivatedRoute);
    const userService = inject(UserService);

    this.loginUri = userService.getLoginUri(route.snapshot
        .queryParams['route']
    );

    userService.getAuthenticatedUser()
      .subscribe(user => this.user = user);
  }
}
