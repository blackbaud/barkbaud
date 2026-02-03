import { Component, OnInit, inject } from '@angular/core';

import {
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  ModalAddCurrentHomeComponent
} from '../../modals/modal-add-current-home/modal-add-current-home.component';

import {
  DogService
} from '../../../../shared/services';

import {
  DOG_ID,
  Owner
} from '../../../../shared/models';

import {
  CustomError
} from '../../../../shared/models/custom-error';
import { λ1, λ3, λ2, λ5, λ4 } from '@skyux/tiles';

import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule, SkyFluidGridModule } from '@skyux/layout';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SkyRepeaterModule } from '@skyux/lists';
import { λ1 as λ1_1 } from '@skyux/avatar';
import { SkyDatePipe } from '@skyux/datetime';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-dog-tile-current-home',
    templateUrl: './dog-tile-current-home.component.html',
    styleUrls: ['./dog-tile-current-home.component.scss'],
    imports: [λ1, λ3, λ2, SkyIconModule, λ5, SkyToolbarModule, LoadingComponent, λ4, SkyRepeaterModule, SkyFluidGridModule, λ1_1, SkyDatePipe, SkyAppResourcesPipe]
})
export class DogTileCurrentHomeComponent implements OnInit {
  private skyModalService = inject(SkyModalService);
  private dogService = inject(DogService);
  private dogId = inject(DOG_ID);


  public isLoading = true;
  public showError: boolean = false;

  public owner: Owner;

  public ngOnInit() {
    this.getCurrentHome();
  }

  public openAddModal() {
    this.skyModalService
      .open(
        ModalAddCurrentHomeComponent,
        [
          {
            provide: DOG_ID,
            useValue: this.dogId
          }
        ]
      )
    .closed
    .subscribe((result: SkyModalCloseArgs) => {
      if (result.data) {
        this.getCurrentHome();
      } else if (result.data && result.data.error)  {
        this.handleError(result.data.error);
      }
    });
  }

  public handleError(error: CustomError) {
    this.showError = true;
  }

  private getCurrentHome() {
    this.dogService
      .getCurrentHome(this.dogId)
      .subscribe(owner => {
        this.owner = owner;
        this.isLoading = false;
      });
  }
}
