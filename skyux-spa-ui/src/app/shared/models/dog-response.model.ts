import {
  Dog
} from './dog.model';

export interface DogResponse {
  count: number;
  value: Dog[];
}
