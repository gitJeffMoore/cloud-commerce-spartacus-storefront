import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '../layout/layout.module';

import { HomePageComponent } from './home-page/home-page.component';
import { CardPageComponent } from './card-page/card-page.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutModule
    ],
    declarations: [
        HomePageComponent,
        CardPageComponent
    ],
    exports: [
        HomePageComponent
    ]
})
export class TemplatesModule { }
