import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable, BehaviorSubject
} from 'rxjs';

import {
  map,
  shareReplay,
  tap
} from 'rxjs/operators';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  UserService
} from './user.service';

import {
  Dog,
  DogResponse,
  Owner,
  Response
} from '../models';

@Injectable()
export class DogService {
  private dogs: Observable<Dog[]>;

  private envid: string;

  private previousHomes = new BehaviorSubject<Owner[]>([]);

  constructor(
    private httpClient: HttpClient,
    private skyAppConfig: SkyAppConfig,
    private userService: UserService
  ) {
    this.userService
      .getAuthenticatedUser()
      .pipe(
        map(user => user.environment_id)
      )
      .subscribe(envid => this.envid = envid);

    this.dogs = this.httpClient
      .get<DogResponse>(
        `${this.skyAppConfig.skyux.appSettings.bffUrl}api/dogs`,
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
        `${this.skyAppConfig.skyux.appSettings.bffUrl}api/${endpoint}`,
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
        `${this.skyAppConfig.skyux.appSettings.bffUrl}api/${endpoint}`,
        data,
        {
          withCredentials: true
        }
      );
  }
}
