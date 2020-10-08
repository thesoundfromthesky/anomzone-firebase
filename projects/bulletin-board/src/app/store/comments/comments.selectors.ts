import { createSelector } from '@ngxs/store';
import {
  CommentsStateModel,
  COMMENTS_STATE_TOKEN,
  CommentsCollection,
} from './comments-state.models';

export class CommentsSelectors {
  static list(rootPath: string, path: string) {
    return createSelector(
      [COMMENTS_STATE_TOKEN],
      (state: CommentsStateModel): CommentsCollection => {
        return state[rootPath]?.[path];
      }
    );
  }
}
