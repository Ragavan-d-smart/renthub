export interface Comment {
  id: string;
  propertyId: number;
  userId: string;
  content: string;
  parentCommentId?: string;
  createdAt: string;
}
