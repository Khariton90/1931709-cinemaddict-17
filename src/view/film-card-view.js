import AbstractView from '../framework/view/abstract-view';
import { getHumanizeYear } from '../utils';

const createFilmCardTemplate = (film = {}) => {
  const { comments, filmInfo, userDetails } = film;
  const {
    title,
    totalRating,
    poster,
    description,
    genre,
    runtime,
    release
  } = filmInfo;

  const {watchlist, alreadyWatched, favorite} = userDetails;

  const year = getHumanizeYear(release.date);

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>`
  );
};


export default class FilmCardView extends AbstractView {
  constructor(film) {
    super();
    this.film = film;
  }

  get template() {
    return createFilmCardTemplate(this.film);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.element.querySelector('.film-card__poster').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    document.body.classList.add('hide-overflow');
    this._callback.click();
  };

  setHandleWatchlistClick(callback) {
    this._callback.watchClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#handleWatchlistClick);
  }

  #handleWatchlistClick = (evt) => {
    evt.preventDefault();

    this._callback.watchClick();
  };

  setHandleAlreadyWatchedClick(callback) {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#handleAlreadyWatchedClick);
  }

  #handleAlreadyWatchedClick = (evt) => {
    evt.preventDefault();

    this._callback.alreadyWatched();
  };

  setHandleFavoritesClick(callback) {
    this._callback.favorites = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#handleFavoriesClick);
  }

  #handleFavoriesClick = (evt) => {
    evt.preventDefault();

    this._callback.favorites();
  };

}
