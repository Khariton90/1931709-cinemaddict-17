import { FilterTypes, UpdateType } from '../consts';
import { remove, render, RenderPosition, replace } from '../framework/render';
import { filter } from '../utils';
import FilterView from '../view/filter-view';
import HeaderView from '../view/header-view';
import RatingView from '../view/rating-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;
  #filterModel = null;
  #filmsModel = null;
  #headerComponent = null;
  #ratingComponent = null;

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
    const prevRatingComponent = this.#ratingComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#ratingComponent = new RatingView(filters);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
      this.#renderHeader();
      render(this.#ratingComponent, this.#headerComponent.element);
      return;
    }

    replace(this.#ratingComponent, prevRatingComponent);
    remove(prevRatingComponent);

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #renderHeader = () => {
    this.#headerComponent = new HeaderView();
    render(this.#headerComponent, this.#filterContainer, RenderPosition.BEFOREBEGIN);
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
