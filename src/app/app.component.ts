import { Component, ViewChild, AfterViewInit, Inject, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
    title = 'movie-info';
    description = 'Search a movie or series, get a quick description. Simple, right?';
    displayedColumns: string[] = ['poster', 'title', 'year', 'movieSeries'];
    search = '';

    exampleDatabase: ExampleHttpDatabase | null;
    data: OMDBMovie[] = [];
    currentMovie: OMDBMovie = null;

    resultsLength = 0;
    pageSize = 10;
    isLoadingResults = true;
    isEmpty = false;
    emptyMessage = 'No movies or series were found! Try another search, or be more precise in your search.';

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    constructor(private httpClient: HttpClient, public dialog: MatDialog) {}

    ngAfterViewInit(): void {
        this.exampleDatabase = new ExampleHttpDatabase(this.httpClient);
    }

    onKey(event: KeyboardEvent): void {
        console.log(event, this.search);
        if (event.code === 'Enter') {
            if (!this.search) {
                this.isEmpty = false;
                return;
            }
            this.findMovies();
        }
    }

    openMovieDialog(movieId: string): void {
        this.exampleDatabase.findMovieDetail(movieId).subscribe({
            next: movie => this.dialog.open(DialogOverviewComponent, { width: '35%', data: movie }),
            error: err => console.log(err)
        });
    }

    findMovies(): void {
        const byYearComparator = (a: OMDBMovie, b: OMDBMovie) => {
            if (a.Year > b.Year) {
                return -1;
            } else if (b.Year > a.Year) {
                return 1;
            }
            return 0;
        };

        this.paginator.pageIndex = 0;
        this.paginator.page
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.exampleDatabase.findMoviesAndSeries(this.search, this.paginator.pageIndex);
                }),
                map(data => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.isEmpty = false;
                    this.resultsLength = data.totalResults;
                    data.Search.sort(byYearComparator);
                    return data.Search;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isEmpty = true;
                    return observableOf([]);
                })
            )
            .subscribe(data => this.data = data);
    }
}

export interface OmdbApi {
    Search: OMDBMovie[];
    totalResults: number;
}

export interface OMDBMovie {
    imdbID: string;
    Poster: string;
    Title: string;
    Year: string;
    Type: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    BoxOffice: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {

    private MY_API_KEY = '';
    private href = 'http://www.omdbapi.com/?apikey=' + MY_API_KEY;

    constructor(private httpClient: HttpClient) {}

    findMoviesAndSeries(search: string, page: number): Observable<OmdbApi> {
        const requestUrl = this.href + '&s=' + `${search}&page=${page + 1}`;
        return this.httpClient.get<OmdbApi>(requestUrl);
    }

    findMovieDetail(movieId: string): Observable<OMDBMovie> {
        const requestUrl = this.href + '&i=' + `${movieId}&plot=full`;
        return this.httpClient.get<OMDBMovie>(requestUrl);
    }
}

@Component({
    selector: 'dialog-overview',
    templateUrl: './dialog-overview.html',
})
export class DialogOverviewComponent {

    constructor(public dialogRef: MatDialogRef<DialogOverviewComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
   }
}
