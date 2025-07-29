import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output
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
  CustomError
} from '../../../../shared/models/custom-error';

import {
  DogService
} from '../../../../shared/services';

import {
  ModalAddBehaviorTrainingComponent
} from '../../modals/modal-add-behavior-training/modal-add-behavior-training.component';

import {
  ModalEditBehaviorTrainingComponent
} from '../../modals/modal-edit-behavior-training/modal-edit-behavior-training.component';

import {
  ModalEditBehaviorTrainingContext
} from '../../modals/modal-edit-behavior-training/modal-edit-behavior-training.context';

@Component({
    // tslint:disable-next-line
    selector: 'div.app-dog-tile-behavior-training',
    templateUrl: './dog-tile-behavior-training.component.html',
    styleUrls: ['./dog-tile-behavior-training.component.scss'],
    standalone: false
})
export class DogTileBehaviorTrainingComponent implements OnInit {

  public isLoading = true;
  public behaviorTrainings: BehaviorTraining[];
  public behaviorTrainingCount = 0;
  public dog: Dog;
  public showError: boolean = false;

  @Output()
  public error = new EventEmitter<CustomError>();

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
        this.behaviorTrainingCount = this.behaviorTrainings.length;
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
      } else if (result.data && result.data.error)  {
        this.handleError(result.data.error);
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
      } else if (result.data && result.data.error)  {
        this.error.next(result.data.error);
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
      }
    });
  }

  public deleteRating(behaviorTraining: BehaviorTraining) {
    this.dogService.deleteBehaviorTraining(this.dogId, behaviorTraining._id)
    .subscribe(() => {
      this.isLoading = false;
      this.loadBehaviorTrainings();
    });
  }

  public loadBehaviorTrainings() {
    this.dogService
    .getBehaviorTrainings(this.dogId)
      .subscribe(behaviorTrainings => {
        this.behaviorTrainings = behaviorTrainings;
        this.behaviorTrainingCount = behaviorTrainings.length;
      });
  }

  public handleError(error: CustomError) {
    this.showError = true;
  }
}
