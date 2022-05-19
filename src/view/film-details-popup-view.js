import AbstractView from '../framework/view/abstract-view';

const createFilmDetailsPopupTemplate = (film, comments) => {

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

  const {watchlist, alreadyWatched, favorite} = userDetails;

  const getGenre = (genres) => genres.map((item) => `<span class="film-details__genre">${item}</span>`);
  const titleGenre = genre.length > 1 ? 'Genres' : 'Genre';


  const commentsTemplate = comments.map((popupComment) => {
    const { emotion, comment, author, date } = popupComment;

    return (
      `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`);
  });
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
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
            <td class="film-details__cell">${release.date}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${runtime}</td>
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

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button ${watchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button ${alreadyWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button ${favorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>
  <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${commentsTemplate.join('')}
           </ul>
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
         </label>
        </div>
      </div>
     </section>
    </div>
  </form>
  </section>`
  );};

export default class FilmDetailsPopupView extends AbstractView {
  #film = null;
  #comments = null;

  get template() {
    return createFilmDetailsPopupTemplate(this.#film, this.#comments);
  }

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  }

  setKeyDownHandler(callback) {
    this._callback.keydown = callback;

    document.addEventListener('keydown', this.#keyDownHandler);
  }

  #keyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      this._callback.keydown();

      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#keyDownHandler);
    }
  };

  #clickHandler = (evt) => {
    evt.preventDefault();

    this._callback.click();

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#keyDownHandler);
  };


  setHandleWatchlistClick(callback) {
    this._callback.watchClick = callback;
    this.element.querySelector('#watchlist').addEventListener('click', this.#handleWatchlistClick);
  }

  #handleWatchlistClick = (evt) => {
    evt.preventDefault();

    this._callback.watchClick();
  };

  setHandleAlreadyWatchedClick(callback) {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('#watched').addEventListener('click', this.#handleAlreadyWatchedClick);
  }

  #handleAlreadyWatchedClick = (evt) => {
    evt.preventDefault();

    this._callback.alreadyWatched();
  };

  setHandleFavoritesClick(callback) {
    this._callback.favorites = callback;
    this.element.querySelector('#favorite').addEventListener('click', this.#handleFavoriesClick);
  }

  #handleFavoriesClick = (evt) => {
    evt.preventDefault();

    this._callback.favorites();
  };
}
