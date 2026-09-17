import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { Property } from '../../../core/models/property.model';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,

  ],
  templateUrl: './create-property.html',
  styleUrl: './create-property.scss'
})
export class CreateProperty {

  createPropertyForm: FormGroup;
  availableAmenities = [
    'Parking',
    'WiFi',
    'Gym',
    'Swimming Pool',
    'Lift',
    'Security'
  ];
  editingPropertyId = '';
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
    private route: ActivatedRoute
  ) {

    this.createPropertyForm =
      this.fb.group({

        title: [
          '',
          Validators.required
        ],

        address: [
          '',
          Validators.required
        ],

        rent: [
          '',
          Validators.required
        ],

        bedrooms: [
          '',
          Validators.required
        ],

        bathrooms: [
          '',
          Validators.required
        ],

        city: [
          '',
          Validators.required
        ],

        state: [
          '',
          Validators.required
        ],

        squareFeet: [
          '',
          [
            Validators.required,
            Validators.min(100)
          ]
        ],

        imageUrl: [
          '',
          Validators.required
        ],

        furnished: [
          'NO',
          Validators.required
        ],

        leaseType: [
          'LONG_TERM',
          Validators.required
        ],

        description: [
          '',
          [
            Validators.required,
            Validators.minLength(20)
          ]
        ],

        amenities: [[]]

      });
  }

  ngOnInit(): void {
    const propertyId =
      this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.isEditMode = true;
      this.editingPropertyId = propertyId;
      this.loadProperty(propertyId);
    }
  }

  loadProperty(
    propertyId: string
  ): void {
    this.propertyService
      .getPropertyById(propertyId)
      .subscribe({
        next: (property) => {
          this.createPropertyForm.patchValue({
            title: property.title,
            address: property.address,
            city: property.city,
            state: property.state,
            rent: property.rent,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            squareFeet: property.squareFeet,
            imageUrl:
              property.images?.[0] ?? '',
            furnished:
              property.furnished
                ? 'YES'
                : 'NO',
            leaseType:
              property.leaseType,
            description:
              property.description,
            amenities:
              property.amenities ?? []
          });
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  toggleAmenity(
    amenity: string,
    checked: boolean
  ): void {

    const amenities =
      this.createPropertyForm.get('amenities')?.value || [];

    if (checked) {
      amenities.push(amenity);
    } else {
      const index =
        amenities.indexOf(amenity);
      if (index >= 0) {
        amenities.splice(index, 1);
      }
    }

    this.createPropertyForm.patchValue({
      amenities
    });

  }

  onSubmit(): void {

    if (this.createPropertyForm.invalid) {
      return;
    }

    const currentUser =
      this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    const property: Property = {
      id: this.isEditMode
        ? this.editingPropertyId
        : crypto.randomUUID(),

      title: this.createPropertyForm.value.title,

      description:
        this.createPropertyForm.value.description,

      address:
        this.createPropertyForm.value.address,

      city:
        this.createPropertyForm.value.city,

      state:
        this.createPropertyForm.value.state,

      rent:
        Number(
          this.createPropertyForm.value.rent
        ),

      bedrooms:
        Number(
          this.createPropertyForm.value.bedrooms
        ),

      bathrooms:
        Number(
          this.createPropertyForm.value.bathrooms
        ),

      squareFeet:
        Number(
          this.createPropertyForm.value.squareFeet
        ),

      furnished:
        this.createPropertyForm.value.furnished === 'YES',

      leaseType:
        this.createPropertyForm.value.leaseType,

      amenities:
        this.createPropertyForm.value.amenities,

      images: [
        this.createPropertyForm.value.imageUrl
      ],

      ownerId: currentUser.id,

      featured: false,

      createdAt:
        new Date().toISOString()
    };

    if (this.isEditMode) {

      this.propertyService
        .updateProperty(property)
        .subscribe({
          next: () => {
            this.snackbar.info(
              'Property updated successfully'
            );
            this.router.navigate([
              '/my-properties'
            ]);

          },
          error: (error) => {
            console.error(error);
          }
        });
    } else {
      this.propertyService
        .createProperty(property)
        .subscribe({
          next: () => {
            this.snackbar.info(
              'Property created successfully'
            );
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

}