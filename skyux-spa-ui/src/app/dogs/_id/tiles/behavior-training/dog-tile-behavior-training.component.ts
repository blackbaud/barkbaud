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
import { ModalAddBehaviorTrainingContext } from '../../modals/modal-add-behavior-training/modal-add-behavior-training.context';

@Component({
  // tslint:disable-next-line
  selector: 'div.app-dog-tile-behavior-training',
  templateUrl: './dog-tile-behavior-training.component.html',
  styleUrls: ['./dog-tile-behavior-training.component.scss']
})
export class DogTileBehaviorTrainingComponent implements OnInit {

  @Output()
  public reload = new EventEmitter<boolean>();

  public isLoading = true;
  public behaviorTrainings: BehaviorTraining[];

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
      .subscribe(behaviorTraining => {
        this.behaviorTrainings = behaviorTraining;
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
        ]);
  }

  public editBehaviorTraining(behaviorTraining: BehaviorTraining) {
    let context: ModalAddBehaviorTrainingContext = {
      dogId: this.dogId,
      behaviorTraining: behaviorTraining
    };
    let windowContext = [{ provide: DOG_ID, ModalAddBehaviorTrainingContext, useValue: this.dogId, context }];
    let modalInstance = this.skyModalService.open(ModalAddBehaviorTrainingComponent, windowContext);
    // let modalInstance = this.skyModalService
    // .open(
    //  ModalAddBehaviorTrainingComponent,
    //  [
    //    {
     //     provide: DOG_ID, ModalAddBehaviorTrainingContext,
     //     useValue: this.dogId, context
     //  }
    // ]);
    modalInstance.closed.pipe(take(1)).subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'save') {
        this.reload.next(true);
      }
    });
  }

  public deleteBehaviorTraining(behaviorTraining: BehaviorTraining) {
    const dialog: SkyConfirmInstance = this.confirmService.open({
      message: `Are you sure you want to delete the following rating?`,
      body: behaviorTraining.category.name + `\n` + behaviorTraining.value,
      type: SkyConfirmType.YesCancel
    });

    dialog.closed.subscribe((result: any) => {
      if (result.action === 'yes') {
        this.deleteRating(behaviorTraining);
        this.reload.next(true);
      }
    });
  }

  public deleteRating(behaviorTraining: BehaviorTraining) {
    this.dogService.deleteBehaviorTraining(this.dogId, behaviorTraining._id)
    .subscribe(() => {
      this.isLoading = false;
    });
  }
}
