import {
  MedicalHistory
} from './medical-history.model';

import {
  Owner
} from './owner.model';

export interface Dog {
  _id?: string;
  bio?: string;
  breed?: string;
  createdAt?: string;
  gender?: string;
  image?: {
    file?: string;
    data?: string;
    src?: string
  };
  name?: string;
  notes?: MedicalHistory[];
  owners?: Owner[];
  ratings?: any;
  updatedAt?: string;
}
