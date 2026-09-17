import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Property } from '../models/property.model';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(
      `${this.apiUrl}/properties`
    );
  }

  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(
      `${this.apiUrl}/properties/${id}`
    );
  }

  getPropertiesByIds(
    propertyIds: string[]
  ): Observable<Property[]> {

    return forkJoin(
      propertyIds.map(
        id =>
          this.getPropertyById(id)
      )
    );

  }

  createProperty(
    property: Property
  ) {
    return this.http.post<Property>(
      `${this.apiUrl}/properties`,
      property
    );
  }

  getPropertiesByOwnerId(
    ownerId: string
  ) {
    return this.http.get<Property[]>(
      `${this.apiUrl}/properties?ownerId=${ownerId}`
    );
  }

  deleteProperty(
    propertyId: string
  ) {
    return this.http.delete(
      `${this.apiUrl}/properties/${propertyId}`
    );
  }

  updateProperty(
    property: Property
  ) {
    return this.http.put<Property>(
      `${this.apiUrl}/properties/${property.id}`,
      property
    );
  }

}