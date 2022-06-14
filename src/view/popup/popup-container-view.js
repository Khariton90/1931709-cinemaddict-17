import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createPopupContainerViewTemplate = () => (
  '<section class="film-details"></section>'
);

export default class PopupContainerView extends AbstractStatefulView {
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

