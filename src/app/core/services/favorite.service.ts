import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Favorite } from '../models/favorite.model';

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {

    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    addFavorite(
        favorite: Favorite
    ): Observable<Favorite> {
        return this.http.post<Favorite>(
            `${this.apiUrl}/favorites`,
            favorite
        );
    }

    getFavorites(): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(
            `${this.apiUrl}/favorites`
        );
    }

    getFavoritesByUserId(
        userId: string
    ): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(
            `${this.apiUrl}/favorites?userId=${userId}`
        );
    }

    removeFavorite(
        favoriteId: string
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/favorites/${favoriteId}`
        );

    }

    getFavoriteByUserAndProperty(
        userId: string,
        propertyId: string
    ): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(
            `${this.apiUrl}/favorites?userId=${userId}&propertyId=${propertyId}`
        );
    }


}