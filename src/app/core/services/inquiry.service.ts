import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Inquiry } from '../models/inquiry.model';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  addInquiry(
    inquiry: Inquiry
  ): Observable<Inquiry> {

    return this.http.post<Inquiry>(
      `${this.apiUrl}/inquiries`,
      inquiry
    );

  }

  getInquiriesByUserId(
    userId: string
  ): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(
      `${this.apiUrl}/inquiries?userId=${userId}`
    );
  }

}