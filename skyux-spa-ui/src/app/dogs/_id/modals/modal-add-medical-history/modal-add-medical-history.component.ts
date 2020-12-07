import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  Dog,
  DOG_ID,
  MedicalHistory
} from '../../../../shared/models';

import {
  DogService
} from '../../../../shared/services';

@Component({
  selector: 'app-modal-add-medical-history',
  templateUrl: './modal-add-medical-history.component.html',
  styleUrls: ['./modal-add-medical-history.component.scss']
})
export class ModalAddMedicalHistoryComponent implements OnInit {

  public noteTypes: Array<string> = [];

  // Medical history fields
  public createdAt: string;
  public date: string;
  public description: string;
  public type: string;
  public title: string;
  public updatedAt: string;
  public medicalHistories: MedicalHistory[];

   constructor (
    private instance: SkyModalInstance,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

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
      updatedAt: undefined
  };

    this.dogService
    .addMedicalHistory(
      this.dogId,
      medicalHistory
    )
    .subscribe((dog: Dog) => {
      this.instance
        .save(dog);
        this.loadMedicalHistories();
    });
  }

  public cancel() {
    this.instance
      .cancel();
  }

  public loadMedicalHistories() {
    this.dogService
    .getMedicalHistory(this.dogId)
      .subscribe(medicalHistories => {
        this.medicalHistories = medicalHistories;
      });
  }
}
