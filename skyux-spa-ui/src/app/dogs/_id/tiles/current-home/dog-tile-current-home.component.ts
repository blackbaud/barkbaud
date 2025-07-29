import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

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

@Component({
    // tslint:disable-next-line
    selector: 'div.app-dog-tile-current-home',
    templateUrl: './dog-tile-current-home.component.html',
    styleUrls: ['./dog-tile-current-home.component.scss'],
    standalone: false
})
export class DogTileCurrentHomeComponent implements OnInit {

  public isLoading = true;
  public showError: boolean = false;

  public owner: Owner;

  constructor (
    private skyModalService: SkyModalService,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

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
