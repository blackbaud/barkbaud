import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

@Component({
  selector: 'app-modal-add-medical-history',
  templateUrl: './modal-add-medical-history.component.html',
  styleUrls: ['./modal-add-medical-history.component.scss']
})
export class ModalAddMedicalHistoryComponent {
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
