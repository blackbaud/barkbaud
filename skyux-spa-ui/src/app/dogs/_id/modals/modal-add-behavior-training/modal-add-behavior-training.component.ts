import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

@Component({
  selector: 'app-modal-add-behavior-training',
  templateUrl: './modal-add-behavior-training.component.html',
  styleUrls: ['./modal-add-behavior-training.component.scss']
})
export class ModalAddBehaviorTrainingComponent {
  constructor (
    private instance: SkyModalInstance
  ) { }

  public save() {
    this.instance
      .save();
  }

  public cancel() {
    this.instance
      .cancel();
  }
}
