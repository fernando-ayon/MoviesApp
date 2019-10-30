import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogOverviewComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashesToSpacesPipe } from './shared/dashes-to-spaces.pipe';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OnGoingFilmPipePipe } from './shared/on-going-film-pipe.pipe';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        AppComponent,
        DashesToSpacesPipe,
        OnGoingFilmPipePipe,
        DialogOverviewComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        FormsModule,
        MatDialogModule,
    ],
    entryComponents: [
        DialogOverviewComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
