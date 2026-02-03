import {
  Component, Input
} from '@angular/core';
import { NgClass } from '@angular/common';
import { λ14 } from '@skyux/indicators';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [NgClass, λ14]
})
export class LoadingComponent {
  @Input()
  public isLoading = false;
}
