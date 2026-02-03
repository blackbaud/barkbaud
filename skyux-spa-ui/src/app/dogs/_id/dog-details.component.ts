import { Component, Input, OnInit, inject } from '@angular/core';

import { SkyWaitService, λ8, λ7, λ6 } from '@skyux/indicators';

import { SkyTileDashboardConfig, SkyTileDashboardMessage, SkyTileDashboardMessageType, SkyTileDashboardModule } from '@skyux/tiles';

import {
  Subject
} from 'rxjs';

import {
  DogService
} from '../../shared/services';

import {
  Dog,
  DOG_ID
} from '../../shared/models';

import {
  DogTileCurrentHomeComponent,
  DogTilePreviousHomesComponent,
  DogTileMedicalHistoryComponent,
  DogTileBehaviorTrainingComponent
} from './tiles';

import { SkyPageSummaryModule, SkyToolbarModule } from '@skyux/layout';
import { λ1 } from '@skyux/avatar';
import { RouterLink } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeComponentClassDirective } from '@skyux/theme';
import { SkyAppResourcesPipe } from '@skyux/i18n';

@Component({
    selector: 'app-dog-details',
    templateUrl: './dog-details.component.html',
    styleUrls: ['./dog-details.component.scss'],
    imports: [SkyPageSummaryModule, λ1, λ8, λ7, λ6, SkyToolbarModule, RouterLink, SkyIconModule, SkyThemeComponentClassDirective, SkyTileDashboardModule, SkyAppResourcesPipe]
})
export class DogDetailsComponent implements OnInit {
  skyWaitService = inject(SkyWaitService);
  dogService = inject(DogService);

  @Input()
  public id: string;

  public dashboardConfig: SkyTileDashboardConfig;

  public dashboardStream = new Subject<SkyTileDashboardMessage>();

  public dog: Dog;

  public ngOnInit() {
    const providers = [
      {
        provide: DOG_ID,
        useValue: this.id
      }
    ];

    this.dashboardConfig = {
      tiles: [
        {
          id: 'current-home',
          componentType: DogTileCurrentHomeComponent,
          providers
        },
        {
          id: 'previous-homes',
          componentType: DogTilePreviousHomesComponent,
          providers
        },
        {
          id: 'medical-history',
          componentType: DogTileMedicalHistoryComponent,
          providers
        },
        {
          id: 'behavior-training',
          componentType: DogTileBehaviorTrainingComponent,
          providers
        }
      ],
      layout: {
        singleColumn: {
          tiles: [
            {
              id: 'current-home',
              isCollapsed: false
            },
            {
              id: 'previous-homes',
              isCollapsed: false
            },
            {
              id: 'medical-history',
              isCollapsed: false
            },
            {
              id: 'behavior-training',
              isCollapsed: false
            }
          ]
        },
        multiColumn: [
          {
            tiles: [
              {
                id: 'current-home',
                isCollapsed: false
              },
              {
                id: 'previous-homes',
                isCollapsed: false
              }
            ]
          },
          {
            tiles: [
              {
                id: 'medical-history',
                isCollapsed: false
              },
              {
                id: 'behavior-training',
                isCollapsed: false
              }
            ]
          }
        ]
      }
    };

    const getDogObs = this.dogService
      .getDogById(this.id);

    this.skyWaitService
      .nonBlockingWrap(getDogObs)
      .subscribe(dog => this.dog = dog);
  }

  public setDashboardState(collapse: boolean) {
    this.dashboardStream
      .next({
        type: collapse ? SkyTileDashboardMessageType.CollapseAll : SkyTileDashboardMessageType.ExpandAll
      });
  }
}
