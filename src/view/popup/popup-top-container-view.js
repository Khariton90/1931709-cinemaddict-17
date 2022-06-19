import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { getHumanizeDate, getHumanizeTime } from '../../utils';

const createPopupTopContainerViewTemplate = (film, state) => {
  const { filmInfo, userDetails } = film;
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    description,
    genre,
    runtime,
    release,
    director,
    actors,
    writers
  } = filmInfo;

  const { watchlist, alreadyWatched, favorite } = userDetails;

  const getGenre = (genres) => genres.map((item) => `<span class="film-details__genre">${item}</span>`);
  const titleGenre = genre.length > 1 ? 'Genres' : 'Genre';

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">18+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">${director}</td>
              <td class="film-details__cell">Anthony Mann</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getHumanizeDate(release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getHumanizeTime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">USA</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${titleGenre}</td>
              <td class="film-details__cell">
                ${getGenre(genre)}
            </tr>
          </table>
          <p class="film-details__film-description">${description}</p>
        </div>
      </div>
      <section class="film-details__controls" ${state.isDisabled ? 'disabled' : ''}>
        <button type="button" class="film-details__control-button ${watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${alreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`
  );};

export default class PopupTopContainerView extends AbstractStatefulView {
  constructor (film) {
    super();

    this.#film = film;
    this.#setInnerHandlers();
  }

  #film = null;

  get template() {
    return createPopupTopContainerViewTemplate(this.#film, this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('#watchlist').addEventListener('click', this.#handleWatchlistClick);
    this.element.querySelector('#watched').addEventListener('click', this.#handleAlreadyWatchedClick);
    this.element.querySelector('#favorite').addEventListener('click', this.#handleFavoriesClick);
  };

  #handleWatchlistClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      isDisabled: true
    });
    this._callback.watchClick();
  };

  #handleAlreadyWatchedClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      isDisabled: true
    });
    this._callback.alreadyWatched();
  };

  #handleFavoriesClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      isDisabled: true
    });
    this._callback.favorites();
  };

  setHandleWatchlistClick(callback) {
    this._callback.watchClick = callback;
    this.element.querySelector('#watchlist').addEventListener('click', this.#handleWatchlistClick);
  }

  setHandleFavoritesClick(callback) {
    this._callback.favorites = callback;
    this.element.querySelector('#favorite').addEventListener('click', this.#handleFavoriesClick);
  }

  setHandleAlreadyWatchedClick(callback) {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('#watched').addEventListener('click', this.#handleAlreadyWatchedClick);
  }
}

