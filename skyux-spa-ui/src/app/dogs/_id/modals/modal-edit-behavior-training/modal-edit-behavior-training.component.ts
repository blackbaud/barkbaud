import {
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import * as moment from 'moment';

import {
  Dog,
  DOG_ID
} from '../../../../shared/models';

import {
  BehaviorTraining
} from '../../../../shared/models/behavior-training.model';

import {
  RatingDataType
} from '../../../../shared/models/category-data-type.model';

import {
  DogService
} from '../../../../shared/services';

import {
  ModalEditBehaviorTrainingContext
} from './modal-edit-behavior-training.context';

@Component({
  selector: 'app-modal-edit-behavior-training',
  templateUrl: './modal-edit-behavior-training.component.html',
  styleUrls: ['./modal-edit-behavior-training.component.scss']
})
export class ModalEditBehaviorTrainingComponent implements OnInit {

  @Input()
  public textCategoryValue: string;

  @Input()
  public numberCategoryValue: string;

  @Input()
  public dateCategoryValue: any;

  @Input()
  public currencyCategoryValue: string;

  @Input()
  public booleanCategoryValue: string;

  @Input()
  public codeTableCategoryValue: string;

  private readonly MAXINT = 2147483647;
  public behaviorTraining: BehaviorTraining;
  public numberValueOptions = { minimumValue: 0, maximumValue: this.MAXINT, decimalPlaces: 0 };
  public currencyValueOptions = {};
  public booleanValueOptions = [{
    value: true,
    label: 'Yes'
  }, {
    value: false,
    label: 'No'
  }];
  public categoryValues: string[];

  constructor (
    public context: ModalEditBehaviorTrainingContext,
    private instance: SkyModalInstance,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

  public ngOnInit() {
    if (this.context && this.context.behaviorTraining) {
      this.behaviorTraining = this.context.behaviorTraining;
    }

    if (this.behaviorTraining.category.type.toString() === 'CodeTable') {
      this.getCodeTableEntryValues(this.behaviorTraining.category.name);
    }

    switch (this.behaviorTraining.category.type.toString()) {
      case 'Text':
        this.textCategoryValue = this.behaviorTraining.value;
        break;
      case 'Number':
        this.numberCategoryValue = this.behaviorTraining.value;
        break;
      case 'DateTime':
        this.dateCategoryValue = this.behaviorTraining.value;
        break;
      case 'Currency':
        this.currencyCategoryValue = this.behaviorTraining.value;
        break;
      case 'Boolean':
        this.booleanCategoryValue = this.behaviorTraining.value;
        break;
      case 'CodeTable':
        this.codeTableCategoryValue = this.behaviorTraining.value;
        break;
      default: break;
    }

  }

  public save() {

    switch (this.behaviorTraining.category.type.toString()) {
      case 'Text':
        this.behaviorTraining.value = this.textCategoryValue;
        break;
      case 'Number':
        this.behaviorTraining.value = this.numberCategoryValue;
        break;
      case 'DateTime':
        this.behaviorTraining.value = moment(this.dateCategoryValue).format('YYYY-MM-DD');
        break;
      case 'Currency':
        this.behaviorTraining.value = this.currencyCategoryValue;
        break;
      case 'Boolean':
        this.behaviorTraining.value = this.booleanCategoryValue;
        break;
      case 'CodeTable':
        this.behaviorTraining.value = this.codeTableCategoryValue;
        break;
      default: break;
    }

    this.dogService
    .editBehaviorTraining(
      this.dogId,
      this.context.behaviorTraining._id,
      this.context.behaviorTraining
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

  public getRatingDataTypeEnum(ratingDataType: RatingDataType): RatingDataType {
    switch (ratingDataType.toString()) {
      case 'Unknown':
        return 0;
      case 'Text':
        return 1;
      case 'Number':
        return 2;
      case 'DateTime':
        return 3;
      case 'Currency':
        return 4;
      case 'Boolean':
        return 5;
      case 'CodeTable':
        return 6;
      default:
        return 1;
    }
  }

  private getCodeTableEntryValues(codeTableName: string): string[] {
    this.dogService.getCategoryValues(codeTableName)
        .subscribe((result: string[]) => {
          this.categoryValues = result;
        });
    return this.categoryValues;
  }

}
