import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Property } from '../../../core/models/property.model';
import { PropertyService } from '../../../core/services/property.service';
import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';
import { Favorite } from '../../../core/models/favorite.model';
import { Comment } from '../../../core/models/comment.model';
import { CommentService } from '../../../core/services/comment.service';
import { InquiryService } from '../../../core/services/inquiry.service';
import { Inquiry } from '../../../core/models/inquiry.model';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  templateUrl: './property-details.html',
  styleUrl: './property-details.scss'
})
export class PropertyDetails implements OnInit {

  property: Property | null = null;
  comments: Comment[] = [];
  newComment = '';
  replyText = '';
  newInquiry = '';
  showInquiryForm = false;
  replyingToCommentId = '';
  isFavorite = false;
  favoriteId = '';

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private commentService: CommentService,
    private inquiryService: InquiryService,
    private snackbar: SnackbarService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    const propertyId = this.route.snapshot.paramMap.get('id');

    if (!propertyId) {
      return;
    }

    this.propertyService
      .getPropertyById(propertyId)
      .subscribe({
        next: (property) => {
          this.property = property;
          this.loadComments(property.id);
          const currentUser =
            this.authService.getCurrentUser();
          if (currentUser) {
            this.favoriteService
              .getFavoriteByUserAndProperty(
                currentUser.id,
                property.id
              )
              .subscribe({
                next: (favorites) => {
                  if (favorites.length > 0) {
                    this.isFavorite = true;
                    this.favoriteId = favorites[0].id;
                  }
                  this.cdr.detectChanges();
                }
              });
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  addToFavorites(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !this.property) {
      return;
    }

    const favorite: Favorite = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      propertyId: this.property.id
    };

    this.favoriteService
      .addFavorite(favorite)
      .subscribe({
        next: (favorite) => {
          this.isFavorite = true;
          this.favoriteId = favorite.id;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  removeFromFavorites(): void {
    if (!this.favoriteId) {
      return;
    }

    this.favoriteService
      .removeFavorite(this.favoriteId)
      .subscribe({
        next: () => {
          this.isFavorite = false;
          this.favoriteId = '';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.removeFromFavorites();
    } else {
      this.addToFavorites();
    }

  }

  loadComments(
    propertyId: string
  ): void {
    this.commentService
      .getCommentsByPropertyId(propertyId)
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  postComment(): void {
    const currentUser =
      this.authService.getCurrentUser();

    if (
      !currentUser ||
      !this.property ||
      !this.newComment.trim()
    ) {
      return;
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      propertyId: Number(this.property.id),
      userId: currentUser.id,
      content: this.newComment,
      createdAt: new Date().toISOString()
    };

    this.commentService
      .addComment(comment)
      .subscribe({
        next: (savedComment) => {
          this.comments.push(savedComment);
          this.newComment = '';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  startReply(
    commentId: string
  ): void {
    this.replyingToCommentId = commentId;
    this.replyText = '';
  }

  cancelReply(): void {
    this.replyingToCommentId = '';
    this.replyText = '';
  }

  postReply(
    parentCommentId: string
  ): void {

    const currentUser =
      this.authService.getCurrentUser();

    if (
      !currentUser ||
      !this.property ||
      !this.replyText.trim()
    ) {
      return;
    }

    const reply: Comment = {
      id: crypto.randomUUID(),
      propertyId: Number(this.property.id),
      userId: currentUser.id,
      content: this.replyText,
      parentCommentId,
      createdAt: new Date().toISOString()
    };

    this.commentService
      .addComment(reply)
      .subscribe({
        next: (savedReply) => {
          this.comments.push(savedReply);
          this.replyText = '';
          this.replyingToCommentId = '';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getParentComments(): Comment[] {
    return this.comments.filter(
      comment => !comment.parentCommentId
    );
  }

  getReplies(
    parentCommentId: string
  ): Comment[] {

    return this.comments.filter(
      comment =>
        comment.parentCommentId ===
        parentCommentId
    );

  }

  toggleInquiryForm(): void {
    this.showInquiryForm =
      !this.showInquiryForm;
  }

  submitInquiry(): void {
    const currentUser =
      this.authService.getCurrentUser();

    if (
      !currentUser ||
      !this.property ||
      !this.newInquiry.trim()
    ) {
      return;
    }

    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      propertyId: this.property.id,
      userId: currentUser.id,
      message: this.newInquiry,
      createdAt:
        new Date().toISOString()
    };

    this.inquiryService
      .addInquiry(inquiry)
      .subscribe({
        next: () => {

          this.newInquiry = '';

          this.showInquiryForm = false;
          this.snackbar.info(
            'Inquiry submitted successfully'
          );

        },
        error: (error) => {
          console.error(error);
        }
      });

  }
}
