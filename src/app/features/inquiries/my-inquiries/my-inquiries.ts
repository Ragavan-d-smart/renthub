import {
  Component,
  OnInit
} from '@angular/core';

import { ChangeDetectorRef } from '@angular/core';

import { Inquiry } from '../../../core/models/inquiry.model';

import { InquiryService } from '../../../core/services/inquiry.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-inquiries',
  standalone: true,
  imports: [],
  templateUrl: './my-inquiries.html',
  styleUrl: './my-inquiries.scss'
})
export class MyInquiries implements OnInit {

  inquiries: Inquiry[] = [];

  constructor(
    private inquiryService: InquiryService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries(): void {

    const currentUser =
      this.authService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    this.inquiryService
      .getInquiriesByUserId(
        currentUser.id
      )
      .subscribe({
        next: (inquiries) => {

          this.inquiries = inquiries;

          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error(error);
        }
      });

  }

}