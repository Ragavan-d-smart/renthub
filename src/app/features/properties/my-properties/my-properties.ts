import { Component, OnInit } from '@angular/core';
import { Property } from '../../../core/models/property.model';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyCard } from '../../../shared/components/property-card/property-card';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [
    PropertyCard
  ],
  templateUrl: './my-properties.html',
  styleUrl: './my-properties.scss'
})
export class MyProperties implements OnInit {

  properties: Property[] = [];

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    const currentUser =
      this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    this.propertyService
      .getPropertiesByOwnerId(currentUser.id)
      .subscribe({
        next: (properties) => {
          this.properties = properties;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  deleteProperty(
    propertyId: string
  ): void {
    const confirmed =
      confirm(
        'Are you sure you want to delete this property?'
      );

    if (!confirmed) {
      return;
    }

    this.propertyService
      .deleteProperty(propertyId)
      .subscribe({
        next: () => {

          this.properties =
            this.properties.filter(
              property =>
                property.id !== propertyId
            );

          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error(error);
        }
      });

  }

}