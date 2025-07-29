import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  SkyConfirmService,
  SkyConfirmType
} from '@skyux/modals';

import {
  UserService
} from '../../services';

import {
  User
} from '../../models';

@Component({
    selector: 'app-nav',
    templateUrl: './app-nav.component.html',
    styleUrls: ['./app-nav.component.scss'],
    standalone: false
})
export class AppNavComponent implements OnInit {
  public user: User;

  public nav = [
    {
      titleKey: 'nav_home',
      path: '/'
    },
    {
      titleKey: 'nav_dashboard',
      path: '/dogs'
    }
  ];

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private skyConfirmService: SkyConfirmService,
    private userService: UserService
  ) { }

  public ngOnInit() {
    this.userService
      .getAuthenticatedUser()
      .subscribe(user => this.user = user);

    if (this.route.snapshot.queryParams.error) {
      const dialog = this.skyConfirmService
        .open({
          message: this.route.snapshot.queryParams.error,
          type: SkyConfirmType.OK
        });

      dialog.closed
        .subscribe(() => {
          this.router
            .navigate(
              [],
              {
                queryParamsHandling: 'merge',
                queryParams: {
                  error: undefined
                }
              }
            );
        });
    }
  }

  // https://github.com/blackbaud/skyux-avatar/blob/master/src/app/public/modules/avatar/avatar.inner.component.ts#L68
  public get colorIndex(): number {
    if (!this.user) {
      return 1;
    }

    const name = this.user.legal_entity_name + this.user.environment_name;
    const seed = name.charCodeAt(0) + name.charCodeAt(name.length - 1) + name.length;

    // 12 colors but 1-based index
    return Math.abs(seed % 12) + 1;
  }
}
