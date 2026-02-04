import { Component, OnInit, inject } from '@angular/core';

import {
  DogService
} from '../../../../shared/services';

import {
  DOG_ID,
  Owner
} from '../../../../shared/models';
import { SkyTilesModule } from '@skyux/tiles';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SkyRepeaterModule } from '@skyux/lists';

import { SkyDatePipe } from '@skyux/datetime';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-dog-tile-previous-homes',
    templateUrl: './dog-tile-previous-homes.component.html',
    styleUrls: ['./dog-tile-previous-homes.component.scss'],
    imports: [SkyTilesModule, LoadingComponent, SkyRepeaterModule, SkyDatePipe, SkyAppResourcesPipe]
})
export class DogTilePreviousHomesComponent implements OnInit {
  private dogService = inject(DogService);
  private dogId = inject(DOG_ID);


  public isLoading = true;

  public owners: Owner[];

  public ownersValidLength = 0;

  public ngOnInit() {
    this.dogService
      .getPreviousHomes(this.dogId)
      .subscribe(owners => {
        this.owners = owners;
        this.ownersValidLength = owners.filter(o => o.constituent).length;
        this.isLoading = false;
      });
  }
}
