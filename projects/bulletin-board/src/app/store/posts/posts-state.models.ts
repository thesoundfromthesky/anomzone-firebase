import { StateToken } from '@ngxs/store';
import { DocMap } from '@src/app/core/firebase';

export interface Post extends DocMap {
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
  userId: string;
}

export interface PostsCollection {
  data: Dictionary<Post>;
  isEnd: boolean;
  hasLoaded: boolean;
}

export interface PostsStateModel {
  [key: string]: PostsCollection;
}

export type PostsMap = Record<'data', Post[]> & Omit<PostsCollection, 'data'>;

export const POSTS_STATE_TOKEN = new StateToken<PostsStateModel>('posts');
