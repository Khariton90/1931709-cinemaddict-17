import { createElement } from '../render';

const createFilmDetailsPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get"></form>
  </section>`
);

export default class FilmDetailsPopupView{
  getTemplate() {
    return createFilmDetailsPopupTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
