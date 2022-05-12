import { generateComment } from '../mock/comment';
import { generateFilm } from '../mock/film';

const FILMS_MAX_LENGTH = 22;
const COMMENTS_MAX_LENGTH = 10;

export default class FilmsModel {
  #films = Array.from({ length: FILMS_MAX_LENGTH }, generateFilm);
  #comments = Array.from({ length: COMMENTS_MAX_LENGTH }, generateComment);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
