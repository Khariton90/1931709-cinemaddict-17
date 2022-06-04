import { FilterTypes, UpdateType } from '../consts';
import { remove, render, replace } from '../framework/render';
import { filter } from '../utils';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;
  #filterModel = null;
  #filmsModel = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        name: FilterTypes.ALL,
        link: '#all',
        type: 'All movies',
        count: filter[FilterTypes.ALL](films).length
      },
      {
        name: FilterTypes.FAVORITES,
        link: '#favorites',
        type: 'Favorites',
        count: filter[FilterTypes.FAVORITES](films).length
      },
      {
        name: FilterTypes.HISTORY,
        link: '#history',
        type: 'History',
        count: filter[FilterTypes.HISTORY](films).length
      },
      {
        name: FilterTypes.WATCHLIST,
        link: '#watchlist',
        type: 'Watchlist',
        count: filter[FilterTypes.WATCHLIST](films).length
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
