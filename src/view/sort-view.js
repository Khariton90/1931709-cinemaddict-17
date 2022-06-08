import { SortType } from '../consts';
import AbstractView from '../framework/view/abstract-view';
import cn from 'classnames';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
      <li><a href="#" class="sort__button ${cn({'sort__button--active': currentSortType === SortType.DEFAULT})}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${cn({'sort__button--active': currentSortType === SortType.DATE})}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${cn({'sort__button--active': currentSortType === SortType.RATING})}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);


export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
