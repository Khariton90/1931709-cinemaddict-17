import { generateComment } from '../mock/comment';
import { generateFilm } from '../mock/film';

export default class FilmsModel {
  #films = Array.from({ length: 22 }, generateFilm);
  #comments = Array.from({ length: 10 }, generateComment);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
