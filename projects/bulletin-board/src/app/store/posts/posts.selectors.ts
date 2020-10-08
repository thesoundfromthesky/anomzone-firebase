import { createSelector } from '@ngxs/store';
import {
  PostsStateModel,
  Post,
  POSTS_STATE_TOKEN,
  PostsCollection,
} from './posts-state.models';

export class PostsSelectors {
  static list(path: string) {
    return createSelector(
      [POSTS_STATE_TOKEN],
      (state: PostsStateModel): PostsCollection => {
        return state[path];
      }
    );
  }

  static get(path: string, id: string) {
    return createSelector(
      [POSTS_STATE_TOKEN],
      (state: PostsStateModel): Post => {  
        return state[path]?.data[id];
      }
    );
  }
}
