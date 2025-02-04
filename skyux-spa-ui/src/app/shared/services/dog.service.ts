import { HttpClient } from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import {
  map,
  shareReplay,
  tap
} from 'rxjs/operators';
import {
  Dog,
  DogResponse,
  MedicalHistory,
  Owner,
  Response
} from '../models';
import {
  BehaviorTraining
} from '../models/behavior-training.model';
import {
  Category
} from '../models/category.model';
import { BaseService } from './base.service';
import {
  UserService
} from './user.service';

@Injectable()
export class DogService extends BaseService {
  private dogs: Observable<Dog[]>;

  private envid: string | undefined;

  private previousHomes = new BehaviorSubject<Owner[]>([]);

  constructor(
    httpClient: HttpClient,
    private userService: UserService
  ) {
    super(httpClient);

    this.userService
      .getAuthenticatedUser()
      .pipe(
        map(user => user.environment_id)
      )
      .subscribe(envid => this.envid = envid);

    this.dogs = this.httpClient
      .get<DogResponse>(
        `${this.bffUrl}api/dogs`,
        {
          withCredentials: true
        }
      )
      .pipe(
        map(response => response.value),
        tap(dogs => dogs.forEach(
          dog => dog.image.src = `data:image/png;base64,${dog.image.data}`
        )),
        shareReplay(1)
      );
  }

  public getDogs(): Observable<Dog[]> {
    return this.dogs;
  }

  public getDogById(id: string): Observable<Dog> {
    return this.dogs
      .pipe(
        map(dogs => dogs.find(dog => dog._id === id))
      );
  }

  public getCurrentHome(id: string): Observable<Owner> {
    return this.get(`dogs/${id}/currenthome`)
      .pipe(
        map(response => response.value[0]),
        tap(owner => {
          if (owner) {
            this.addConstituentLink(owner);
          }
        })
      );
  }

  public setCurrentHome(dogId: string, ownerId: string): Observable<Dog> {
    return this.post<Dog>(`dogs/${dogId}/currenthome`, { id: ownerId })
      .pipe(
        // Trigger the previous homes tab to repopulate
        tap(() => this.fetchPreviousHomes(dogId))
      );
  }

  public getFindHome(id: string, searchText: string): Observable<Owner[]> {
    return this.get(`dogs/${id}/findhome?searchText=${searchText}`)
      .pipe(
        map(response => response.value)
      );
  }

  public getPreviousHomes(id: string): Observable<Owner[]> {
    this.fetchPreviousHomes(id);
    return this.previousHomes;
  }

  public getNoteTypes(): Observable<string[]> {
    return this.get(`dogs/notetypes`)
      .pipe(
        map(response => response.value)
      );
  }

  public getSources(): Observable<string[]> {
    return this.get(`dogs/ratings/sources`)
      .pipe(
        map(response => response.value)
      );
  }

  public getCategories(sourceName: string): Observable<Category[]> {
    return this.get(`dogs/ratings/categories?sourceName=${sourceName}`)
      .pipe(
        map(response => response.value)
      );
  }

  public getCategoryValues(categoryName: string): Observable<string[]> {
    return this.get(`dogs/ratings/categories/values?categoryName=${categoryName}`)
      .pipe(
        map(response => response.value)
      );
  }

  public addMedicalHistory(dogId: string, medHistory: MedicalHistory): Observable<Dog> {
    return this.post<Dog>(`dogs/${dogId}/notes`, medHistory);
  }

  public getMedicalHistories(dogId: string): Observable<MedicalHistory[]> {
    return this.get(`dogs/${dogId}/notes`)
      .pipe(
        map(response => response.value)
      );
  }

  public addBehaviorTraining(dogId: string, rating: BehaviorTraining): Observable<Dog> {
    return this.post<Dog>(`dogs/${dogId}/ratings`, rating);
  }

  public editBehaviorTraining(dogId: string, behaviorTrainingId: string, rating: BehaviorTraining): Observable<Dog> {
    return this.patch<Dog>(`dogs/${dogId}/ratings/${behaviorTrainingId}`, rating);
  }

  public deleteBehaviorTraining(dogId: string, behaviorTrainingId: string): Observable<Response> {
    return this.delete(`dogs/${dogId}/ratings/${behaviorTrainingId}`);
  }

  public getBehaviorTrainings(dogId: string): Observable<BehaviorTraining[]> {
    return this.get(`dogs/${dogId}/ratings`)
      .pipe(
        map(response => response.value)
      );
  }

  public getBehaviorTraining(dogId: string, behaviorTrainingId: string): Observable<BehaviorTraining> {
    return this.get(`dogs/${dogId}/ratings/${behaviorTrainingId}`)
      .pipe(
        map(response => response.value)
      );
  }

  private addConstituentLink(owner: Owner): void {
    if (owner.constituentId) {
      owner.constituentLink = `https://renxt.blackbaud.com/constituents/${owner.constituentId}?envid=${this.envid}`;
    }
  }

  private fetchPreviousHomes (id: string): void {
    this.get(`dogs/${id}/previoushomes`)
      .pipe(
        map(response => response.value),
        tap(owners => owners.forEach((owner: Owner) => this.addConstituentLink(owner)))
      )
      .subscribe(owners => this.previousHomes.next(owners));
  }

  private get(endpoint: string): Observable<Response> {
    return this.httpClient
      .get<Response>(
        `${this.bffUrl}api/${endpoint}`,
        {
          withCredentials: true
        }
      )
      .pipe(
        shareReplay(1)
      );
  }

  private post<T>(
    endpoint: string,
    data: any
  ): Observable<T> {
    return this.httpClient
      .post<T>(
        `${this.bffUrl}api/${endpoint}`,
        data,
        {
          withCredentials: true
        }
      );
  }

  private patch<T>(
    endpoint: string,
    data: any
  ): Observable<T> {
    return this.httpClient
      .patch<T>(
        `${this.bffUrl}api/${endpoint}`,
        data,
        {
          withCredentials: true
        }
      );
  }

  private delete(endpoint: string): Observable<Response> {
    return this.httpClient
      .delete<Response>(
        `${this.bffUrl}api/${endpoint}`,
        {
          withCredentials: true
        }
      )
      .pipe(
        shareReplay(1)
      );
  }
}
