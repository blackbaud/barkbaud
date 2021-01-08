import {
  Component,
  Inject
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  BehaviorSubject
} from 'rxjs';

import {
  DogService
} from '../../../../shared/services';

import {
  DOG_ID,
  Owner,
  Dog
} from '../../../../shared/models';

@Component({
  selector: 'app-modal-add-current-home',
  templateUrl: './modal-add-current-home.component.html',
  styleUrls: ['./modal-add-current-home.component.scss']
})
export class ModalAddCurrentHomeComponent {

  public ownerSelectedId: string;

  public searchText: string;

  public owners = new BehaviorSubject<Owner[]>([]);

  public isSearching = false;

  constructor (
    private instance: SkyModalInstance,
    private dogService: DogService,
    @Inject(DOG_ID) private dogId: string
  ) { }

  public searchApplied(searchText: string) {
    this.owners.next([]);
    this.searchText = searchText;
    this.ownerSelectedId = undefined;

    if (searchText) {
      this.isSearching = true;
      this.dogService
        .getFindHome(this.dogId, searchText)
        .subscribe(owners => {
          this.owners.next(owners);
          this.isSearching = false;
        });
    }
  }

  public setSelected(selectedMap: Map<string, boolean>) {
    this.ownerSelectedId = Array.from(selectedMap.keys())[0];
  }

  public save() {

    this.dogService
      .setCurrentHome(
        this.dogId,
        this.ownerSelectedId
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
}
