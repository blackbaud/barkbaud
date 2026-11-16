import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppNavComponent } from '../shared/components/nav/app-nav.component';
import { PageComponent } from '../shared/components/page/page.component';
import { AuthComponent } from './auth.component';

@Component({
    selector: 'app-auth-route-index',
    templateUrl: './index.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AppNavComponent, PageComponent, AuthComponent]
})
export class AuthRouteIndexComponent {}
