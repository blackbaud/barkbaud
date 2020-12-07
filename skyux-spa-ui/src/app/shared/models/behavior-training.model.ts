import {
  Category
} from './category.model';

export interface BehaviorTraining {
  _id?: string;
  category: Category;
  source: string;
  value: any;
}
