import {
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';

import moment from 'moment';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyCheckboxChange
} from '@skyux/forms';

import {
  BehaviorTraining
} from '../../../../shared/models/behavior-training.model';

import {
  Category
} from '../../../../shared/models/category.model';

import {
  Dog,
  DOG_ID
} from '../../../../shared/models';

import {
  DogService
} from '../../../../shared/services';

import {
  RatingDataType
} from '../../../../shared/models/category-data-type.model';

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

  public sources: Array<string> = [];
  public categories: Category[];
  public categoryValues: string[];
  public behaviorTrainings: BehaviorTraining[];
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
    // get rating Sources
    this.dogService.getSources()
      .subscribe(value => this.sources = value);
  }

  public onSourceChanged() {

    const selectedSourceId = this.source;

    // get rating categories
    this.dogService.getCategories(selectedSourceId)
      .subscribe(value => this.categories = value);
  }

  public onCategoryChanged() {

    this.ratingDataTypeEnum = this.getSelectedRatingDataTypeEnum();

     // If selected category has data type CodeTable, look up the entries for that code table
     if (this.ratingDataTypeEnum === RatingDataType.CodeTable) {
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
    switch (ratingDataType.toString().toLowerCase()) {
      case 'unknown':
        return this.ratingDataTypeEnum = 0;
      case 'text':
        return this.ratingDataTypeEnum = 1;
      case 'number':
        return this.ratingDataTypeEnum = 2;
      case 'datetime':
        return this.ratingDataTypeEnum = 3;
      case 'currency':
        return this.ratingDataTypeEnum = 4;
      case 'boolean':
        return this.ratingDataTypeEnum = 5;
      case 'codetable':
        return this.ratingDataTypeEnum = 6;
      default:
        return this.ratingDataTypeEnum = 1;
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
      case 'codeTable':
        return this.codeTableCategoryValue;
      default: break;
    }
  }

}
