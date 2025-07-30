import {
  Component, Input
} from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: false
})
export class LoadingComponent {
  @Input()
  public isLoading = false;
}
