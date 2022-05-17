import AbstractView from '../framework/view/abstract-view';

const createFilterViewTemplate = (filters) => {

  const filterLinksTemplate = filters.map((filter) => {
    const { name, link, count } = filter;
    const countTemplate = link === '#all' ? '' : `<span class="main-navigation__item-count">${count}</span>`;

    return (
      `<a href="${link}" class="main-navigation__item">${name} ${countTemplate}</a>`
    );
  })
    .join('');

  return (
    `<nav class="main-navigation">${filterLinksTemplate}</nav>`
  );};

export default class FilterView extends AbstractView {
  #filters = null;

  get template() {
    return createFilterViewTemplate(this.#filters);
  }

  constructor(filters) {
    super();

    this.#filters = filters;
  }
}
