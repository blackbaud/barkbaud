import {
  Component, Input, inject
} from '@angular/core';

import {
  SkyConfirmCloseEventArgs,
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType
} from '@skyux/modals';

import {
  SkyAppResourcesService
} from '@skyux/i18n';

import {
  UserService
} from '../../services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  @Input()
  public isPrimaryButton = true;

  public authenticated: boolean;

  private logoutMessage: string;

  private skyConfirmService = inject(SkyConfirmService);
  private userService = inject(UserService);

  constructor () {
    const skyAppResourcesService = inject(SkyAppResourcesService);
    this.userService
      .isUserAuthenticated()
      .subscribe(authenticated => this.authenticated = authenticated);

    skyAppResourcesService.getString('confirm_logout')
      .subscribe(msg => this.logoutMessage = msg);
  }

  public confirmLogout() {
    const dialog: SkyConfirmInstance = this.skyConfirmService
      .open({
        message: this.logoutMessage,
        type: SkyConfirmType.YesCancel
      });

    dialog.closed
      .subscribe((result: SkyConfirmCloseEventArgs) => {
        if (result.action === 'yes') {
          window.location.href = this.userService
            .getLogoutUri();
        }
      });
  }
}
