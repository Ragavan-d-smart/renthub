import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Property } from '../../../core/models/property.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-property-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss'
})
export class PropertyCard {

  @Input() property!: Property;
  @Input() showRemoveFavorite = false;
  @Input() showDeleteButton = false;
  @Output() deleteProperty = new EventEmitter<string>();
  @Input() showEditButton = false;
  
  @Output() removeFavorite =
    new EventEmitter<string>();

}