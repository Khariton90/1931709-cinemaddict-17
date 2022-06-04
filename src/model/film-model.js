import Observable from '../framework/observable';
import { generateComment } from '../mock/comment';
import { generateFilm } from '../mock/film';

const FILMS_MAX_LENGTH = 22;
const COMMENTS_MAX_LENGTH = 10;

export default class FilmsModel extends Observable {
  #films = Array.from({ length: FILMS_MAX_LENGTH }, generateFilm);
  #comments = Array.from({ length: COMMENTS_MAX_LENGTH }, generateComment);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [...this.#films.slice(0, index),update,...this.#films.slice(index + 1)];

    this._notify(updateType, update);
  };
}
