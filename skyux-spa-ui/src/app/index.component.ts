import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WelcomeComponent } from './shared/components/welcome/welcome.component';

@Component({
    selector: 'app-root-route-index',
    templateUrl: './index.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [WelcomeComponent]
})
export class RootRouteIndexComponent {}
