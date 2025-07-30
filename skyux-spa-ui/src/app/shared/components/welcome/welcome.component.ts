import {
  Component,
  OnInit
} from '@angular/core';

import {
  UserService
} from '../../services';

import {
  User
} from '../../models';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: false
})
export class WelcomeComponent implements OnInit {
  public user: User;

  public loginUri: string;

  constructor(
    private userService: UserService
  ) {
    this.loginUri = this.userService
      .getLoginUri();
  }

  public ngOnInit() {
    this.userService
      .getAuthenticatedUser()
      .subscribe(user => this.user = user);
  }
}
