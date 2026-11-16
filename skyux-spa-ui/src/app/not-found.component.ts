import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SkyAppResourcesPipe]
})
export class NotFoundComponent { }
