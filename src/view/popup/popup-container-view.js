import AbstractView from '../../framework/view/abstract-view';

const createPopupContainerViewTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get"></form>
  </section>`
);

export default class PopupContainerView extends AbstractView {
  get template() {
    return createPopupContainerViewTemplate();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();

    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#keyDownHandler);
  };

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
}

