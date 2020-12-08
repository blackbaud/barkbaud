import {
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';

import * as moment from 'moment';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  BehaviorTraining
} from '../../../../shared/models/behavior-training.model';

import {
  Category
} from '../../../../shared/models/category.model';

import {
  Dog, DOG_ID
} from '../../../../shared/models';

import {
  DogService
} from '../../../../shared/services';

import {
  RatingDataType
} from '../../../../shared/models/category-data-type.model';
import { SkyCheckboxChange } from '@skyux/forms';

@Component({
  selector: 'app-modal-add-behavior-training',
  templateUrl: './modal-add-behavior-training.component.html',
  styleUrls: ['./modal-add-behavior-training.component.scss']
})
export class ModalAddBehaviorTrainingComponent implements OnInit {

  @Input()
  public ratingDataTypeEnum: RatingDataType;

  private readonly MAXINT = 2147483647;
  private categoryName: string;
  private _codeTableEntriesCache: any = {};

  public isEdit = false;
  public title: string;
  public sources: Array<string> = [];
  public categories: Category[];
  public categoryValues: string[];
  public behaviorTrainings: BehaviorTraining[];
  public id: string;
  public source: string;
  public addConstituentRating: boolean;
  public category: Category;
  public textCategoryValue: string;
  public numberCategoryValue: string;
  public dateCategoryValue: any;
  public currencyCategoryValue: string;
  public booleanCategoryValue: any;
  public codeTableCategoryValue: string;
  public ratingDataType: RatingDataType;
  public numberValueOptions = { minimumValue: 0, maximumValue: this.MAXINT, decimalPlaces: 0 };
  public currencyValueOptions = {};
  public booleanValueOptions = [{
    value: true,
    label: 'Yes'
  }, {
    value: false,
    label: 'No'
  }];

  constructor (
    private instance: SkyModalInstance,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

  public ngOnInit() {
    this.dogService.getSources()
      .subscribe(value => this.sources = value);

  }

  public onSourceChanged() {

    const selectedSourceId = this.source;

    this.dogService.getCategories(selectedSourceId)
      .subscribe(value => this.categories = value);
  }

  public onCategoryChanged() {

    this.ratingDataType = this.getSelectedRatingDataType();
    this.ratingDataTypeEnum = this.getSelectedRatingDataTypeEnum();

     // If selected category has data type CodeTable, look up the entries for that code table
     if (this.ratingDataType === RatingDataType.CodeTable) {
      if (!this._codeTableEntriesCache[this.category.name]) {
        this.dogService.getCategoryValues(this.category.name)
          .subscribe((result: string[]) => {
            this.categoryValues = result;
            this._codeTableEntriesCache[this.category.name] = result;
          });
      } else {
        this.categoryValues = this._codeTableEntriesCache[this.category.name];
      }
      return;
    }
  }

  public getSelectedRatingDataType(): RatingDataType {
    this.categoryName = this.category.name;
    if (this.categoryName) {
      return this.getRatingDataTypeEnum(this.categories.find(x => x.name === this.categoryName).type);
    }
    return undefined;
  }

  public getSelectedRatingDataTypeEnum(): RatingDataType {
      this.categoryName = this.category.name;
      if (this.categoryName) {
        return this.getRatingDataTypeEnum(this.categories.find(x => x.name === this.categoryName).type);
      }
    return undefined;
  }

  public save() {
    let behaviorTraining: BehaviorTraining = {
      category: this.category,
      source: this.source,
      value: this.getCategoryValue(this.category.type.toString()),
      addConstituentRating: this.addConstituentRating,
      constituentRatingId: undefined
    };

    this.dogService
      .addBehaviorTraining(
        this.dogId,
        behaviorTraining
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

  public addConstituentRatingEnabled($event: SkyCheckboxChange) {
    this.addConstituentRating = $event.checked;
  }

  private getRatingDataTypeEnum(ratingDataType: RatingDataType): RatingDataType {
    switch (ratingDataType.toString()) {
      case 'Unknown':
        return this.ratingDataTypeEnum = 0;
      case 'Text':
        return this.ratingDataTypeEnum = 1;
      case 'Number':
        return this.ratingDataTypeEnum = 2;
      case 'DateTime':
        return this.ratingDataTypeEnum = 3;
      case 'Currency':
        return this.ratingDataTypeEnum = 4;
      case 'Boolean':
        return this.ratingDataTypeEnum = 5;
      case 'CodeTable':
        return this.ratingDataTypeEnum = 6;
      default:
        return this.ratingDataTypeEnum = 1;
    }
  }

  private getCategoryValue(categoryDataType: string): any {
    switch (categoryDataType) {
      case 'Text':
        return this.textCategoryValue;
      case 'Number':
        return this.numberCategoryValue;
      case 'DateTime':
        return moment(this.dateCategoryValue).format('YYYY-MM-DD');
      case 'Currency':
        return this.currencyCategoryValue;
      case 'Boolean':
        return this.booleanCategoryValue;
      case 'CodeTable':
        return this.codeTableCategoryValue;
      default: break;
    }
  }

}
