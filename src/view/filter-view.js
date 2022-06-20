import AbstractView from '../framework/view/abstract-view';

const createFilterViewTemplate = (filters, currentFilterType) => {
  const filterLinksTemplate = filters.map((filter) => {
    const { name, link, type, count } = filter;
    const countTemplate = link === '#all' ? '' : `<span class="main-navigation__item-count" data-name="${type}">${count}</span>`;

    return (
      `<a href="${link}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-name="${type}">${name} ${countTemplate}</a>`
    );
  })
    .join('');

  return (
    `<nav class="main-navigation">${filterLinksTemplate}</nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterViewTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.name);
  };
}
