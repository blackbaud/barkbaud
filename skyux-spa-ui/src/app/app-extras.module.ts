import {
  NgModule
} from '@angular/core';
import {
  AppSkyModule
} from './app-sky.module';
import { DogService, UserService } from './shared/services';

/**
 * @deprecated Provided services, imported modules, etc. should be moved to
 * their respective feature modules, and this module should be removed.
 */
@NgModule({
    exports: [
      AppSkyModule
    ],
    providers: [
      DogService,
      UserService
    ]
})
export class AppExtrasModule { }
