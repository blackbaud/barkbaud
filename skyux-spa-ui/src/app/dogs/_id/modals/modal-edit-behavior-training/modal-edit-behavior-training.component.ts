import {
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import moment from 'moment';

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

  private _codeTableEntriesCache: any = {};
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

    if (this.behaviorTraining.category.type.toString().toLowerCase() === 'codetable') {
      this.getCodeTableEntryValues(this.behaviorTraining.category.name);
    }

    switch (this.behaviorTraining.category.type.toString()) {
      case 'text':
        this.textCategoryValue = this.behaviorTraining.value;
        break;
      case 'number':
        this.numberCategoryValue = this.behaviorTraining.value;
        break;
      case 'datetime':
        this.dateCategoryValue = this.behaviorTraining.value;
        break;
      case 'currency':
        this.currencyCategoryValue = this.behaviorTraining.value;
        break;
      case 'boolean':
        this.booleanCategoryValue = this.behaviorTraining.value;
        break;
      case 'codetable':
        this.codeTableCategoryValue = this.behaviorTraining.value;
        break;
      default: break;
    }
  }

  public save() {

    this.behaviorTraining.value = this.getCategoryValue(this.behaviorTraining.category.type.toString());

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
    switch (ratingDataType.toString().toLowerCase()) {
      case 'unknown':
        return 0;
      case 'text':
        return 1;
      case 'number':
        return 2;
      case 'datetime':
        return 3;
      case 'currency':
        return 4;
      case 'boolean':
        return 5;
      case 'codetable':
        return 6;
      default:
        return 1;
    }
  }

  private getCategoryValue(categoryDataType: string): any {
    switch (categoryDataType.toLowerCase()) {
      case 'text':
        return this.textCategoryValue;
      case 'number':
        return this.numberCategoryValue;
      case 'datetime':
        return moment(this.dateCategoryValue).format('YYYY-MM-DD');
      case 'currency':
        return this.currencyCategoryValue;
      case 'boolean':
        return this.booleanCategoryValue;
      case 'codetable':
        return this.codeTableCategoryValue;
      default: break;
    }
  }

  private getCodeTableEntryValues(codeTableName: string): string[] {

    if (!this._codeTableEntriesCache[codeTableName]) {
      this.dogService.getCategoryValues(codeTableName)
        .subscribe((result: string[]) => {
          this.categoryValues = result;
          this._codeTableEntriesCache[codeTableName] = result;
        });
    } else {
      this.categoryValues = this._codeTableEntriesCache[codeTableName];
    }
    return this.categoryValues;
  }

}
