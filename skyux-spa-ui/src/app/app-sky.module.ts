import {
  NgModule
} from '@angular/core';

import {
  SkyHeroModule
} from '@blackbaud/skyux-lib-media';

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
  SkyAlertModule,
  SkyIconModule,
  SkyKeyInfoModule,
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
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyListModule
} from '@skyux/list-builder';

import {
  SkyListViewChecklistModule
} from '@skyux/list-builder-view-checklist';

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
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyAutonumericModule
} from '@skyux/autonumeric';

import {
  SkyDropdownModule
} from '@skyux/popovers';

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
    SkyIconModule,
    SkyKeyInfoModule,
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
