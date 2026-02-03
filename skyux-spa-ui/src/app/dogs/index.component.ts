import { Component } from '@angular/core';
import { AppNavComponent } from '../shared/components/nav/app-nav.component';
import { PageComponent } from '../shared/components/page/page.component';
import { DogsListComponent } from './dogs-list.component';

@Component({
    selector: 'app-dogs-route-index',
    templateUrl: './index.component.html',
    imports: [AppNavComponent, PageComponent, DogsListComponent]
})
export class DogsRouteIndexComponent {}
