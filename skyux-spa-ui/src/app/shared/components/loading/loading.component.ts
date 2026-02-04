import {
  Component, Input
} from '@angular/core';
import { NgClass } from '@angular/common';
import { SkyWaitModule } from '@skyux/indicators';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [NgClass, SkyWaitModule]
})
export class LoadingComponent {
  @Input()
  public isLoading = false;
}
