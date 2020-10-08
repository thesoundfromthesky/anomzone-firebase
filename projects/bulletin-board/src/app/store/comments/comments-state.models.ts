import { StateToken } from '@ngxs/store';
import { DocMap } from '@src/app/core/firebase';

export interface Comment extends DocMap {
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
  isVisible: boolean;
  userId: string;
}

export interface CommentsCollection {
  data: Dictionary<Comment>;
  isEnd: boolean;
}

export interface CommentsCollectionRoot {
  [key: string]: CommentsCollection;
}

export interface CommentsStateModel {
  [key: string]: CommentsCollectionRoot;
}

export type CommentsMap = Record<'data', Comment[]> &
  Omit<CommentsCollection, 'data'>;

export const COMMENTS_STATE_TOKEN = new StateToken<CommentsStateModel>(
  'comments'
);
