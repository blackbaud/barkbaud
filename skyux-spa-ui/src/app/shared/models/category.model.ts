import {
  RatingDataType
} from './category-data-type.model';

export interface Category {
  inactive: boolean;
  name: string;
  type: RatingDataType;
}
