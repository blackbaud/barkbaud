import { Component, OnInit, inject } from '@angular/core';

import { SkyCheckboxChange, SkyCheckboxModule } from '@skyux/forms';

import { SkyModalInstance, λ5, λ4, λ2, λ3 } from '@skyux/modals';

import {
  Dog,
  DOG_ID,
  MedicalHistory
} from '../../../../shared/models';

import {
  DogService
} from '../../../../shared/services';
import { SkyResponsiveHostDirective } from '@skyux/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { FormsModule } from '@angular/forms';

import { SkyThemeComponentClassDirective } from '@skyux/theme';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-modal-add-medical-history',
    templateUrl: './modal-add-medical-history.component.html',
    styleUrls: ['./modal-add-medical-history.component.scss'],
    imports: [λ5, λ4, SkyResponsiveHostDirective, λ2, SkyFluidGridModule, FormsModule, SkyThemeComponentClassDirective, SkyCheckboxModule, λ3, SkyAppResourcesPipe]
})
export class ModalAddMedicalHistoryComponent implements OnInit {
  private instance = inject(SkyModalInstance);
  private dogService = inject(DogService);
  private dogId = inject(DOG_ID);


  public noteTypes: Array<string> = [];

  // Medical history fields
  public createdAt: string;
  public date: string;
  public description: string;
  public type: string;
  public title: string;
  public updatedAt: string;
  public medicalHistories: MedicalHistory[];
  public addConstituentNote: boolean;

  public ngOnInit() {
    this.dogService.getNoteTypes()
    .subscribe(value => this.noteTypes = value);
  }

  public save() {

    let medicalHistory: MedicalHistory = {
      createdAt: undefined,
      date: undefined,
      description: this.description,
      type: this.type,
      title: this.title,
      updatedAt: undefined,
      addConstituentNote: this.addConstituentNote
  };

    this.dogService
    .addMedicalHistory(
      this.dogId,
      medicalHistory
    )
    .subscribe((dog: Dog) => {
      this.instance
        .save(dog);
    });
  }

  public cancel() {
    this.instance
      .cancel();
  }

  public addConstituentNoteEnabled($event: SkyCheckboxChange) {
    this.addConstituentNote = $event.checked;
  }
}
