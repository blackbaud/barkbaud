import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  DogService
} from '../../../../shared/services';

import {
  DOG_ID,
  Owner
} from '../../../../shared/models';

@Component({
    // tslint:disable-next-line
    selector: 'div.app-dog-tile-previous-homes',
    templateUrl: './dog-tile-previous-homes.component.html',
    styleUrls: ['./dog-tile-previous-homes.component.scss'],
    standalone: false
})
export class DogTilePreviousHomesComponent implements OnInit {

  public isLoading = true;

  public owners: Owner[];

  public ownersValidLength = 0;

  constructor (
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

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
