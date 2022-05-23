import { SortType } from '../consts';
import AbstractView from '../framework/view/abstract-view';

const createSortTemplate = () => (
  `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);


export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
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

    this.element.querySelectorAll('a').forEach((link) => {
      if (link === evt.target && evt.target.classList.contains('sort__button--active')) {
        return;
      }

      link.classList.remove('sort__button--active');
      evt.target.classList.add('sort__button--active');
    });

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
