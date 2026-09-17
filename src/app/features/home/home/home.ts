import { Component, OnInit } from '@angular/core';

import { Property } from '../../../core/models/property.model';
import { PropertyService } from '../../../core/services/property.service';

import { PropertyCard } from '../../../shared/components/property-card/property-card';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PropertyCard,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  properties: Property[] = [];
  featuredProperties: Property[] = [];
  currentFeaturedIndex = 0;
  searchTerm = '';
  selectedBedrooms = 0;
  selectedFurnished = 'ALL';
  selectedRentRange = 'ALL';
  selectedSort = 'DEFAULT';
  currentPage = 1;
  pageSize = 6;
  currentFeaturedProperty: Property | null = null;

  constructor(
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService
      .getAllProperties()
      .subscribe({
        next: (properties) => {

          this.properties = properties;

          this.featuredProperties =
            properties.filter(
              property => property.featured
            );

          if (this.featuredProperties.length) {
            this.currentFeaturedProperty =
              this.featuredProperties[0];
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  get filteredProperties(): Property[] {
    let filtered = [...this.properties];
    if (this.searchTerm.trim()) {

      const search = this.searchTerm.toLowerCase();

      filtered = filtered.filter(
        property =>
          property.title
            .toLowerCase()
            .includes(search) ||

          property.city
            .toLowerCase()
            .includes(search)
      );
    }

    if (Number(this.selectedBedrooms) > 0) {
      filtered = filtered.filter(
        property =>
          property.bedrooms ===
          Number(this.selectedBedrooms)
      );
    }

    if (this.selectedFurnished === 'FURNISHED') {
      filtered = filtered.filter(
        property => property.furnished
      );
    }

    if (this.selectedFurnished === 'NON_FURNISHED') {
      filtered = filtered.filter(
        property => !property.furnished
      );
    }

    if (this.selectedRentRange === 'UNDER_15000') {
      filtered = filtered.filter(
        property => property.rent < 15000
      );
    }

    if (this.selectedRentRange === 'BETWEEN_15000_30000') {
      filtered = filtered.filter(
        property =>
          property.rent >= 15000 &&
          property.rent <= 30000
      );
    }

    if (this.selectedRentRange === 'ABOVE_30000') {
      filtered = filtered.filter(
        property => property.rent > 30000
      );
    }

    if (this.selectedSort === 'PRICE_LOW_TO_HIGH') {
      filtered.sort(
        (a, b) => a.rent - b.rent
      );
    }

    if (this.selectedSort === 'PRICE_HIGH_TO_LOW') {
      filtered.sort(
        (a, b) => b.rent - a.rent
      );
    }

    return filtered;
  }

  get paginatedProperties(): Property[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex =
      startIndex + this.pageSize;

    return this.filteredProperties.slice(
      startIndex,
      endIndex
    );
  }

  get totalPages(): number {
    return Math.ceil(
      this.filteredProperties.length /
      this.pageSize
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousFeatured(): void {

    if (!this.featuredProperties.length) {
      return;
    }

    this.currentFeaturedIndex =
      this.currentFeaturedIndex === 0
        ? this.featuredProperties.length - 1
        : this.currentFeaturedIndex - 1;

    this.currentFeaturedProperty =
      this.featuredProperties[
      this.currentFeaturedIndex
      ];
  }

  nextFeatured(): void {

    if (!this.featuredProperties.length) {
      return;
    }

    this.currentFeaturedIndex =
      this.currentFeaturedIndex ===
        this.featuredProperties.length - 1
        ? 0
        : this.currentFeaturedIndex + 1;

    this.currentFeaturedProperty =
      this.featuredProperties[
      this.currentFeaturedIndex
      ];
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedBedrooms = 0;
    this.selectedFurnished = 'ALL';
    this.selectedRentRange = 'ALL';
    this.selectedSort = 'DEFAULT';
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }
}