import { Component, OnInit, inject } from '@angular/core';

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
import { λ1, λ3, λ2, λ5, λ4 } from '@skyux/tiles';

import { SkyToolbarModule } from '@skyux/layout';
import { SkyIconModule } from '@skyux/icon';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDatePipe } from '@skyux/datetime';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-dog-tile-medical-history',
    templateUrl: './dog-tile-medical-history.component.html',
    styleUrls: ['./dog-tile-medical-history.component.scss'],
    imports: [λ1, λ3, λ2, λ5, SkyToolbarModule, SkyIconModule, LoadingComponent, λ4, SkyRepeaterModule, SkyDatePipe, SkyAppResourcesPipe]
})
export class DogTileMedicalHistoryComponent implements OnInit {
  private skyModalService = inject(SkyModalService);
  private dogService = inject(DogService);
  private dogId = inject(DOG_ID);


  public isLoading = true;
  public showError: boolean = false;

  public medicalHistories: MedicalHistory[];
  public medicalHistoryCount = 0;

  public ngOnInit() {
    this.dogService
      .getDogById(this.dogId)
      .pipe(
        map(dog => dog.notes)
      )
      .subscribe(medicalHistories => {
        this.medicalHistories = medicalHistories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
        this.medicalHistories = medicalHistories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.medicalHistoryCount = medicalHistories.length;
      });
  }

  public handleError(error: CustomError) {
    this.showError = true;
  }
}
