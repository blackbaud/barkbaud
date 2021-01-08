import {
  NgModule
} from '@angular/core';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  AppSkyModule
} from './app-sky.module';

import {
  DogService,
  UserService
} from './shared/services';

import {
  ModalAddBehaviorTrainingComponent,
  ModalAddCurrentHomeComponent,
  ModalAddMedicalHistoryComponent
} from './dogs/_id/modals';

import {
  DogTileCurrentHomeComponent,
  DogTilePreviousHomesComponent,
  DogTileMedicalHistoryComponent,
  DogTileBehaviorTrainingComponent
} from './dogs/_id/tiles';

@NgModule({
  exports: [
    AppSkyModule,
    HttpClientModule
  ],
  entryComponents: [
    DogTileCurrentHomeComponent,
    DogTilePreviousHomesComponent,
    DogTileMedicalHistoryComponent,
    DogTileBehaviorTrainingComponent,
    ModalAddBehaviorTrainingComponent,
    ModalAddCurrentHomeComponent,
    ModalAddMedicalHistoryComponent
  ],
  providers: [
    DogService,
    UserService
  ]
})
export class AppExtrasModule { }
