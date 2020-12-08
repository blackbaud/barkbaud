import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  SkyConfirmInstance,
  SkyConfirmService,
  SkyConfirmType,
  SkyModalCloseArgs,
  SkyModalService
} from '@skyux/modals';

import {
  map, take
} from 'rxjs/operators';

import {
  Dog,
  DOG_ID
} from '../../../../shared/models';

import {
  BehaviorTraining
} from '../../../../shared/models/behavior-training.model';

import {
  DogService
} from '../../../../shared/services';

import {
  ModalAddBehaviorTrainingComponent
} from '../../modals/modal-add-behavior-training/modal-add-behavior-training.component';

import { ModalEditBehaviorTrainingComponent } from '../../modals/modal-edit-behavior-training/modal-edit-behavior-training.component';
import { ModalEditBehaviorTrainingContext } from '../../modals/modal-edit-behavior-training/modal-edit-behavior-training.context';

@Component({
  // tslint:disable-next-line
  selector: 'div.app-dog-tile-behavior-training',
  templateUrl: './dog-tile-behavior-training.component.html',
  styleUrls: ['./dog-tile-behavior-training.component.scss']
})
export class DogTileBehaviorTrainingComponent implements OnInit {

  public isLoading = true;
  public behaviorTrainings: BehaviorTraining[];
  public dog: Dog;

  constructor (
    private skyModalService: SkyModalService,
    private confirmService: SkyConfirmService,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

  public ngOnInit() {
    this.dogService
      .getDogById(this.dogId)
      .pipe(
        map(dog => dog.ratings)
      )
      .subscribe(behaviorTrainings => {
        this.behaviorTrainings = behaviorTrainings;
        this.isLoading = false;
      });
  }

  public openAddModal() {
    this.skyModalService
      .open(
        ModalAddBehaviorTrainingComponent,
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
        this.loadBehaviorTrainings();
      }
    });
  }

 public editBehaviorTraining(behaviorTraining: BehaviorTraining) {
    let context: ModalEditBehaviorTrainingContext = {
      behaviorTraining: behaviorTraining
     };
    let modalInstance = this.skyModalService
     .open(
      ModalEditBehaviorTrainingComponent,
      [
        {
          provide: DOG_ID,
          useValue: this.dogId
        },
        {
          provide: ModalEditBehaviorTrainingContext,
          useValue: context
        }
    ]);
    modalInstance.closed.pipe(take(1)).subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        this.loadBehaviorTrainings();
      }
    });
  }

  public deleteBehaviorTraining(behaviorTraining: BehaviorTraining) {
    const dialog: SkyConfirmInstance = this.confirmService.open({
      message: `Are you sure you want to delete the following rating?`,
      body: behaviorTraining.category.name + ' ' + '(' + behaviorTraining.value + ')',
      type: SkyConfirmType.YesCancel
    });

    dialog.closed.subscribe((result: any) => {
      if (result.action === 'yes') {
        this.deleteRating(behaviorTraining);
        this.loadBehaviorTrainings();
      }
    });
  }

  public deleteRating(behaviorTraining: BehaviorTraining) {
    this.dogService.deleteBehaviorTraining(this.dogId, behaviorTraining._id)
    .subscribe(() => {
      this.isLoading = false;
    });
  }

  public loadBehaviorTrainings() {
    this.dogService
    .getBehaviorTrainings(this.dogId)
      .subscribe(behaviorTrainings => {
        this.behaviorTrainings = behaviorTrainings;
      });
  }
}
