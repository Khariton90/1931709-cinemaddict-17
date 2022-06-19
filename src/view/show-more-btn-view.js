import AbstractView from '../framework/view/abstract-view';

const createShowMoreBtnTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreBtnView extends AbstractView {
  get template() {
    return createShowMoreBtnTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    this._callback.click();
  };

  setClickHandler(callback) {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#clickHandler);
  }
}
