import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  map
} from 'rxjs/operators';

import {
  ModalAddMedicalHistoryComponent
} from '../../modals/modal-add-medical-history/modal-add-medical-history.component';

import {
  DogService
} from '../../../../shared/services';

import {
  DOG_ID,
  MedicalHistory
} from '../../../../shared/models';

@Component({
  // tslint:disable-next-line
  selector: 'div.app-dog-tile-medical-history',
  templateUrl: './dog-tile-medical-history.component.html',
  styleUrls: ['./dog-tile-medical-history.component.scss']
})
export class DogTileMedicalHistoryComponent implements OnInit {

  public isLoading = true;

  public medicalHistory: MedicalHistory[];

  constructor (
    private skyModalService: SkyModalService,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

  public ngOnInit() {
    this.dogService
      .getDogById(this.dogId)
      .pipe(
        map(dog => dog.notes)
      )
      .subscribe(medicalHistory => {
        this.medicalHistory = medicalHistory;
        this.isLoading = false;
      });
  }

  public openAddModal() {
    this.skyModalService
      .open(ModalAddMedicalHistoryComponent);
  }
}
