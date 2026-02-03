import { Component, inject } from '@angular/core';

import { SkyModalInstance, λ5, λ4, λ2, λ3 } from '@skyux/modals';

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
import { SkyResponsiveHostDirective } from '@skyux/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { NgClass } from '@angular/common';
import { SkyListModule } from '@skyux/list-builder';
import { SkyListViewChecklistModule } from '@skyux/list-builder-view-checklist';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-modal-add-current-home',
    templateUrl: './modal-add-current-home.component.html',
    styleUrls: ['./modal-add-current-home.component.scss'],
    imports: [λ5, λ4, SkyResponsiveHostDirective, λ2, SkyToolbarModule, SkySearchModule, LoadingComponent, SkyListModule, SkyListViewChecklistModule, λ3, NgClass, SkyAppResourcesPipe]
})
export class ModalAddCurrentHomeComponent {
  private instance = inject(SkyModalInstance);
  private dogService = inject(DogService);
  private dogId = inject(DOG_ID);


  public ownerSelectedId: string;

  public searchText: string;

  public owners = new BehaviorSubject<Owner[]>([]);

  public isSearching = false;

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
