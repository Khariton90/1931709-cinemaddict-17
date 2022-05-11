import { generateComment } from '../mock/comment';
import { generateFilm } from '../mock/film';

export default class FilmsModel {
  films = Array.from({length: 10}, generateFilm);
  comments = Array.from({length: 10}, generateComment);

  getFilms = () => this.films;
  getComments = () => this.comments;
}
