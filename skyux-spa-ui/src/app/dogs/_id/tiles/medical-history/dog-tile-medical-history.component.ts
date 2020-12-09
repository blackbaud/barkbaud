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

import {
  CustomError
} from '../../../../shared/models/custom-error';

@Component({
  // tslint:disable-next-line
  selector: 'div.app-dog-tile-medical-history',
  templateUrl: './dog-tile-medical-history.component.html',
  styleUrls: ['./dog-tile-medical-history.component.scss']
})
export class DogTileMedicalHistoryComponent implements OnInit {

  public isLoading = true;
  public showError: boolean = false;

  public medicalHistories: MedicalHistory[];
  public medicalHistoryCount = 0;

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
      .subscribe(medicalHistories => {
        this.medicalHistories = medicalHistories.sort((medhis2, medhis1) =>
        medhis1.date && medhis2.date ? medhis1.date.localeCompare(medhis2.date) : 0);
        this.medicalHistoryCount = this.medicalHistories.length;
        this.isLoading = false;
      });
  }

  public openAddModal() {
    this.skyModalService
      .open(
        ModalAddMedicalHistoryComponent,
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
        this.loadMedicalHistories();
      } else if (result.data && result.data.error)  {
        this.handleError(result.data.error);
      }
    });
  }

  public loadMedicalHistories() {
    this.dogService
    .getMedicalHistories(this.dogId)
      .subscribe(medicalHistories => {
        this.medicalHistories = medicalHistories.sort((medhis2, medhis1) =>
        medhis1.date && medhis2.date ? medhis1.date.localeCompare(medhis2.date) : 0);
        this.medicalHistoryCount = medicalHistories.length;
      });
  }

  public handleError(error: CustomError) {
    this.showError = true;
  }
}
