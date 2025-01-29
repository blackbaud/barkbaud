import {
  NgModule
} from '@angular/core';
import {
  SkyHeroModule
} from '@blackbaud/skyux-lib-media';
import {
  SkyAutonumericModule
} from '@skyux/autonumeric';
import {
  SkyAvatarModule
} from '@skyux/avatar';
import {
  SkyDatepickerModule,
  SkyDatePipeModule
} from '@skyux/datetime';
import {
  SkyErrorModule
} from '@skyux/errors';
import {
  SkyCheckboxModule
} from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyAlertModule,
  
  SkyKeyInfoModule,
  SkyLabelModule,
  SkyTokensModule,
  SkyWaitModule
} from '@skyux/indicators';
import {
  SkyCardModule,
  SkyFluidGridModule,
  SkyPageModule,
  SkyPageSummaryModule,
  SkyTextExpandModule,
  SkyToolbarModule
} from '@skyux/layout';
import {
  SkyListModule
} from '@skyux/list-builder';
import {
  SkyListViewChecklistModule
} from '@skyux/list-builder-view-checklist';
import {
  SkyRepeaterModule
} from '@skyux/lists';
import {
  SkySearchModule
} from '@skyux/lookup';
import {
  SkyConfirmModule,
  SkyModalModule
} from '@skyux/modals';
import {
  SkyNavbarModule
} from '@skyux/navbar';
import {
  SkyDropdownModule
} from '@skyux/popovers';
import {
  SkyTilesModule
} from '@skyux/tiles';

/**
 * @deprecated Each SKY UX module should be imported into each feature module
 * that references the SKY UX module, and this module should be removed.
 */
@NgModule({
  exports: [
    SkyAvatarModule,
    SkyAlertModule,
    SkyAutonumericModule,
    SkyCardModule,
    SkyCheckboxModule,
    SkyConfirmModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyDropdownModule,
    SkyErrorModule,
    SkyFluidGridModule,
    SkyHeroModule,
    SkyI18nModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyListModule,
    SkyListViewChecklistModule,
    SkyModalModule,
    SkyPageModule,
    SkyPageSummaryModule,
    SkyNavbarModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyTextExpandModule,
    SkyTilesModule,
    SkyTokensModule,
    SkyToolbarModule,
    SkyWaitModule
  ]
})
export class AppSkyModule { }
