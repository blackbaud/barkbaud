import {
  Component
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  UserService
} from '../shared/services';

import {
  User
} from '../shared/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public loginUri: string;

  public user: User;

  constructor(
    route: ActivatedRoute,
    userService: UserService
  ) {
    this.loginUri = userService.getLoginUri(route.snapshot
        .queryParams['route']
    );

    userService.getAuthenticatedUser()
      .subscribe(user => this.user = user);
  }
}
