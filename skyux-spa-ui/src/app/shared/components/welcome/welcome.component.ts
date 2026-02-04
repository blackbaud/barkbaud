import { Component, OnInit, inject } from '@angular/core';

import {
  UserService
} from '../../services';

import {
  User
} from '../../models';
import { AppNavComponent } from '../nav/app-nav.component';
import { SkyHeroModule } from '@blackbaud/skyux-lib-media';
import { PageComponent } from '../page/page.component';
import { SkyFluidGridModule } from '@skyux/layout';

import { SkyThemeComponentClassDirective } from '@skyux/theme';
import { SkyAlertModule } from '@skyux/indicators';
import { RouterLink } from '@angular/router';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    imports: [AppNavComponent, SkyHeroModule, PageComponent, SkyFluidGridModule, SkyThemeComponentClassDirective, SkyAlertModule, RouterLink, SkyAppResourcesPipe]
})
export class WelcomeComponent implements OnInit {
  private userService = inject(UserService);

  public user: User;

  public loginUri: string;

  constructor() {
    this.loginUri = this.userService
      .getLoginUri();
  }

  public ngOnInit() {
    this.userService
      .getAuthenticatedUser()
      .subscribe(user => this.user = user);
  }
}
