import { Component, OnInit, inject } from '@angular/core';

import {
  SkyWaitService
} from '@skyux/indicators';

import {
  DogService
} from '../shared/services';

import {
  Dog
} from '../shared/models';

import { SkyCardModule, SkyFluidGridModule, SkyTextExpandModule } from '@skyux/layout';
import { RouterLink } from '@angular/router';
import { λ1 } from '@skyux/avatar';
import { SkyThemeComponentClassDirective } from '@skyux/theme';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-dogs-list',
    templateUrl: './dogs-list.component.html',
    styleUrls: ['./dogs-list.component.scss'],
    imports: [SkyCardModule, SkyFluidGridModule, RouterLink, λ1, SkyTextExpandModule, SkyThemeComponentClassDirective, SkyAppResourcesPipe]
})
export class DogsListComponent implements OnInit {
  private skyWaitService = inject(SkyWaitService);
  private dogService = inject(DogService);

  public dogs: Dog[];

  public ngOnInit() {
    this.skyWaitService
      .nonBlockingWrap(
        this.dogService
          .getDogs()
      )
      .subscribe(dogs => this.dogs = dogs);
  }
}
