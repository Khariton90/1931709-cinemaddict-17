import Observable from '../framework/observable';
import { generateComment } from '../mock/comment';

const COMMENTS_MAX_LENGTH = 10;

export default class CommentsModel extends Observable {
  #comments = Array.from({ length: COMMENTS_MAX_LENGTH }, generateComment);

  get comments() {
    return this.#comments;
  }
}
