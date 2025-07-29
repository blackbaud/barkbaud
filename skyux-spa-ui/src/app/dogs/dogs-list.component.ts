import {
  Component,
  OnInit
} from '@angular/core';

import {
  SkyWaitService
} from '@skyux/indicators';

import {
  DogService
} from '../shared/services';

import {
  Dog
} from '../shared/models';

@Component({
    selector: 'app-dogs-list',
    templateUrl: './dogs-list.component.html',
    styleUrls: ['./dogs-list.component.scss'],
    standalone: false
})
export class DogsListComponent implements OnInit {
  public dogs: Dog[];

  constructor (
    private skyWaitService: SkyWaitService,
    private dogService: DogService
  ) { }

  public ngOnInit() {
    this.skyWaitService
      .nonBlockingWrap(
        this.dogService
          .getDogs()
      )
      .subscribe(dogs => this.dogs = dogs);
  }
}
