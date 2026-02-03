import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, Router, RouterLinkActive, RouterLink } from '@angular/router';

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
import { SkyNavbarModule } from '@skyux/navbar';
import { NgClass } from '@angular/common';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-nav',
    templateUrl: './app-nav.component.html',
    styleUrls: ['./app-nav.component.scss'],
    imports: [SkyNavbarModule, RouterLinkActive, RouterLink, NgClass, SkyAppResourcesPipe]
})
export class AppNavComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private skyConfirmService = inject(SkyConfirmService);
  private userService = inject(UserService);

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
