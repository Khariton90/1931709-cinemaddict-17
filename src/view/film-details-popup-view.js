import { createElement } from '../render';

const createFilmDetailsPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get"></form>
  </section>`
);

export default class FilmDetailsPopupView {
  #element = null;

  get template() {
    return createFilmDetailsPopupTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
