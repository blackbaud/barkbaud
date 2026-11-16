import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet]
})
export class AppComponent {
  title = 'skyux-spa-ui';
}
