import {
  Component
} from '@angular/core';
import { SkyLayoutHostDirective } from '@skyux/core';
import { SkyPageModule } from '@skyux/pages';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    imports: [SkyLayoutHostDirective, SkyPageModule]
})
export class PageComponent {

}
