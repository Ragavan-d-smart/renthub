import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getCommentsByPropertyId(
    propertyId: string
  ): Observable<Comment[]> {

    return this.http.get<Comment[]>(
      `${this.apiUrl}/comments?propertyId=${propertyId}`
    );

  }

  addComment(
    comment: Comment
  ): Observable<Comment> {

    return this.http.post<Comment>(
      `${this.apiUrl}/comments`,
      comment
    );

  }

  deleteComment(
    commentId: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/comments/${commentId}`
    );

  }

}