import FilmsListContainerView from '../view/films-list-container-view';
import SortView from '../view/sort-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import { CARDS_VIEW_STEPS, SortType, UpdateType, UserAction } from '../consts';
import ListEmptyView from '../view/list-empty-view';
import { remove, render } from '../framework/render';
import FilmPresenter from './film-presenter';
import { filter, sortCardDate, sortCardRating } from '../utils';

export default class BoardPresenter {
  #renderedFilmCardsCount = CARDS_VIEW_STEPS;
  #filmsModel = null;
  #boardContainer = null;
  #boardComponent = new FilmsListContainerView();
  #showMoreBtnComponent = null;
  #listEmptyComponent = new ListEmptyView();
  #currentSortType =  SortType.DEFAULT;
  #sortComponent = null;
  #filterModel = null;

  #boardComments = [];
  #filmPresenter = new Map();


  constructor(boardContainer, filmsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCardCount: true, resetSortType: true});
        this.#renderBoard();
    }
  };

  init = () => {
    this.#boardComments = [...this.#filmsModel.comments];

    this.#renderBoard();
  };

  get films() {
    const filterType = this.#filterModel.filter;
    const films = [...this.#filmsModel.films];
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortCardDate);
      case SortType.RATING:
        return filteredFilms.sort(sortCardRating);
    }

    return filteredFilms;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedCardCount: true});
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderListEmpty = () => render(this.#listEmptyComponent, this.#boardContainer);

  #renderShowMoreBtn = () => {
    this.#showMoreBtnComponent = new ShowMoreBtnView();
    render(this.#showMoreBtnComponent, this.#boardContainer);
    this.#showMoreBtnComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleLoadMoreButtonClick = () => {
    const cardCount = this.films.length;
    const newRenderedCardCount = Math.min(cardCount, this.#renderedFilmCardsCount + CARDS_VIEW_STEPS);
    const films = this.films.slice(this.#renderedFilmCardsCount, newRenderedCardCount);

    this.#renderCards(films);

    this.#renderedFilmCardsCount = newRenderedCardCount;

    if (this.#renderedFilmCardsCount >= cardCount) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #renderCards = (films) => {
    films.forEach((film) => this.#renderCard(film));
  };

  #renderCard = (card) => {
    const commentsCard = [...this.#boardComments].filter((comment) => card.comments.includes(comment.id));

    const filmPresenter = new FilmPresenter(this.#boardComponent.element, commentsCard, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(card);
    this.#filmPresenter.set(card.id, filmPresenter);
  };

  #clearBoard = ({resetRenderedCardCount = false, resetSortType = false}) => {
    const cardCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#listEmptyComponent);
    remove(this.#showMoreBtnComponent);

    if (resetRenderedCardCount) {
      this.#renderedFilmCardsCount = CARDS_VIEW_STEPS;
    } else {
      this.#renderedFilmCardsCount = Math.min(cardCount, this.#renderedFilmCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderBoard = () => {
    const cardCount = this.films.length;
    const films = this.films.slice(0, Math.min(cardCount, CARDS_VIEW_STEPS));
    if (!cardCount) {
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    render(this.#boardComponent, this.#boardContainer);
    this.#renderCards(films);

    if (cardCount > CARDS_VIEW_STEPS) {
      this.#renderShowMoreBtn();
    }
  };
}
