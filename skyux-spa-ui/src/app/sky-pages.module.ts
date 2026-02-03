import {
  CommonModule
} from '@angular/common';
import {
  NgModule
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  RouterModule
} from '@angular/router';
import {
  SkyAppAssetsService
} from '@skyux/assets';
import {
  SkyI18nModule
} from '@skyux/i18n';
import {
  SkyAppLinkModule
} from '@skyux/router';
import {
  SkyThemeService
} from '@skyux/theme';
import {
  AppExtrasModule
} from './app-extras.module';
import { ModalAddBehaviorTrainingComponent, ModalAddCurrentHomeComponent, ModalAddMedicalHistoryComponent } from './dogs/_id/modals';
import { DogTileBehaviorTrainingComponent, DogTileCurrentHomeComponent, DogTileMedicalHistoryComponent, DogTilePreviousHomesComponent } from './dogs/_id/tiles';
import {
  NotFoundComponent
} from './not-found.component';
import { RootRouteIndexComponent } from './index.component';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';
import { PageComponent } from './shared/components/page/page.component';
import { AppNavComponent } from './shared/components/nav/app-nav.component';
import { DogsRouteIndexComponent } from './dogs/index.component';
import { DogsListComponent } from './dogs/dogs-list.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ModalEditBehaviorTrainingComponent } from './dogs/_id/modals/modal-edit-behavior-training/modal-edit-behavior-training.component';
import { DogDetailsComponent } from './dogs/_id/dog-details.component';
import { DogsIdRouteIndexComponent } from './dogs/_id/index.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRouteIndexComponent } from './auth/index.component';

/**
 * @deprecated This module was migrated from SKY UX Builder v.4.
 * It is highly recommended that this module be factored-out into separate, lazy-loaded feature modules.
 */
@NgModule({
    imports: [
        AppExtrasModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SkyAppLinkModule,
        SkyI18nModule,
        DogTileCurrentHomeComponent,
        DogTilePreviousHomesComponent,
        DogTileMedicalHistoryComponent,
        DogTileBehaviorTrainingComponent,
        ModalAddBehaviorTrainingComponent,
        ModalAddCurrentHomeComponent,
        ModalAddMedicalHistoryComponent,
        ModalEditBehaviorTrainingComponent,
        AuthComponent,
        PageComponent,
        AppNavComponent,
        LoadingComponent,
        WelcomeComponent,
        DogsListComponent,
        DogDetailsComponent,
        NotFoundComponent,
        RootRouteIndexComponent,
        AuthRouteIndexComponent,
        DogsRouteIndexComponent,
        DogsIdRouteIndexComponent
    ],
    exports: [
        AppExtrasModule,
        DogTileCurrentHomeComponent,
        DogTilePreviousHomesComponent,
        DogTileMedicalHistoryComponent,
        DogTileBehaviorTrainingComponent,
        ModalAddBehaviorTrainingComponent,
        ModalAddCurrentHomeComponent,
        ModalAddMedicalHistoryComponent,
        ModalEditBehaviorTrainingComponent,
        AuthComponent,
        PageComponent,
        AppNavComponent,
        LoadingComponent,
        WelcomeComponent,
        DogsListComponent,
        DogDetailsComponent,
        NotFoundComponent,
        RootRouteIndexComponent,
        AuthRouteIndexComponent,
        DogsRouteIndexComponent,
        DogsIdRouteIndexComponent
    ],
    providers: [
        // This provider is to support the legacy SKY UX asset and i18n
        // functionality. You should refactor your application to use Angular's
        // built-in asset handling and i18n processes instead.
        // https://angular.io/guide/file-structure#application-project-files
        // https://angular.io/guide/i18n-overview
        {
            provide: SkyAppAssetsService,
            useValue: {
                getUrl(path: string) {
                    return '/assets/' + path;
                },
                getAllUrls() {
                    return undefined;
                }
            }
        },
        SkyThemeService
    ]
})
export class SkyPagesModule { }
