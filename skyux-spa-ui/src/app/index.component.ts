import { Component } from '@angular/core';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';

@Component({
    selector: 'app-root-route-index',
    templateUrl: './index.component.html',
    imports: [WelcomeComponent]
})
export class RootRouteIndexComponent {}
