import {
  Component
} from '@angular/core';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    imports: [SkyAppResourcesPipe]
})
export class NotFoundComponent { }
