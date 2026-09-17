import { Component, OnInit } from '@angular/core';

import { Property } from '../../../core/models/property.model';
import { Favorite } from '../../../core/models/favorite.model';

import { FavoriteService } from '../../../core/services/favorite.service';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { PropertyCard } from '../../../shared/components/property-card/property-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    PropertyCard
  ],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {

  favoriteProperties: Property[] = [];
  favorites: Favorite[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private propertyService: PropertyService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  getFavoriteId(
    propertyId: string
  ): string {
    const favorite =
      this.favorites.find(
        favorite =>
          favorite.propertyId === propertyId
      );
    return favorite?.id ?? '';
  }

  removeFavorite(
    propertyId: string
  ): void {

    const favoriteId =
      this.getFavoriteId(propertyId);

    if (!favoriteId) {
      return;
    }
    this.favoriteService
      .removeFavorite(favoriteId)
      .subscribe({
        next: () => {

          this.favoriteProperties =
            this.favoriteProperties.filter(
              property =>
                property.id !== propertyId
            );

          this.favorites =
            this.favorites.filter(
              favorite =>
                favorite.id !== favoriteId
            );

          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  loadFavorites(): void {
    const currentUser =
      this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    this.favoriteService
      .getFavoritesByUserId(currentUser.id)
      .subscribe({
        next: (favorites: Favorite[]) => {
          this.favorites = favorites;
          const propertyIds =
            [...new Set(
              favorites.map(
                favorite => favorite.propertyId
              )
            )];
          console.log('Property Ids:', propertyIds);
          if (!propertyIds.length) {
            return;
          }

          this.propertyService
            .getPropertiesByIds(propertyIds)
            .subscribe({
              next: (properties) => {
                console.log(
                  'Properties Response:',
                  properties
                );
                this.favoriteProperties = properties;
                this.cdr.detectChanges();
              },
              error: (error) => {
                console.error(error);
              }
            });

        },
        error: (error) => {
          console.error(error);
        }
      });

  }
}