import AbstractView from '../framework/view/abstract-view';

const createFilmDetailsPopupTemplate = () => (
  `<section class="film-details">

  </section>`
);

export default class FilmDetailsPopupView extends AbstractView {
  get template() {
    return createFilmDetailsPopupTemplate();
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
    evt.preventDefault();

    if (evt.key === 'Escape' || evt.key === 'Esc') {
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
}
