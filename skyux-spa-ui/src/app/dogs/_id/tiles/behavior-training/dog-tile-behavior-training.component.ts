import {
  Component
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  ModalAddBehaviorTrainingComponent
} from '../../modals/modal-add-behavior-training/modal-add-behavior-training.component';

@Component({
  // tslint:disable-next-line
  selector: 'div.app-dog-tile-behavior-training',
  templateUrl: './dog-tile-behavior-training.component.html',
  styleUrls: ['./dog-tile-behavior-training.component.scss']
})
export class DogTileBehaviorTrainingComponent {
  constructor (
    private skyModalService: SkyModalService
  ) { }

  public openAddModal() {
    this.skyModalService
      .open(ModalAddBehaviorTrainingComponent);
  }
}
