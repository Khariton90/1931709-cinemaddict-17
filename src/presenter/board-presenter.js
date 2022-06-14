import FilmsListContainerView from '../view/films-list-container-view';
import SortView from '../view/sort-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import { CARDS_VIEW_STEPS, Mode, SortType, TimeLimit, UpdateType, UserAction } from '../consts';
import ListEmptyView from '../view/list-empty-view';
import { remove, render, RenderPosition } from '../framework/render';
import FilmPresenter from './film-presenter';
import { filter, getDoubleCards, sortCardComments, sortCardDate, sortCardRating } from '../utils';
import LoadingView from '../view/loading-view';
import FooterView from '../view/footer-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { TopRatingViewContainer } from '../view/films-list-extra/top-rating/top-rating-view-container';
import { MostCommentedView } from '../view/films-list-extra/most-commented/most-commented-view-container';
import FilmsSectionView from '../view/films-section-view';

export default class BoardPresenter {
  #renderedFilmCardsCount = CARDS_VIEW_STEPS;
  #filmsModel = null;
  #boardContainer = null;
  #filmsSectionComponent = new FilmsSectionView();
  #boardComponent = new FilmsListContainerView();
  #showMoreBtnComponent = null;
  #currentSortType =  SortType.DEFAULT;
  #sortComponent = null;
  #filterModel = null;
  #listEmptyComponent = null;
  #commentsModel = null;
  #filmPresenterList = new Map();
  #loadingComponent = new LoadingView();
  #footerComponent = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker();

  #topRatedComponent = null;
  #mostCommentedCompnent = null;

  constructor(boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block(TimeLimit.LOWER, TimeLimit.UPPER);

    switch (actionType) {
      case UserAction.UPDATE_CARD:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
          this.#setScroll(update, actionType);
        } catch(err) {
          this.#filmPresenterList.get(update.id).setAbortingUpdated();
          this.#setScroll(update, actionType);
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentsModel.addComment(updateType, update);
          await this.#filmsModel.updateFilm(updateType, update);
          this.#setScroll(update, actionType);
        } catch (err) {
          this.#filmPresenterList.get(update.id).setAbortingSaving();
          this.#setScroll(update, actionType);
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          await this.#filmsModel.updateFilm(updateType, update);
          this.#setScroll(update, actionType);
        } catch(err) {
          this.#filmPresenterList.get(update.id).setAbortingDeliting();
          this.#setScroll(update, actionType);
        }
    }

    this.#uiBlocker.unblock();
  };

  #setScroll = (update, action) => {
    if (update.mode === Mode.OPEN) {
      this.#filmPresenterList.get(update.id).setScroll(action);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenterList.get(data.id).init(data);
        this.#clearExtraBoard();
        this.#renderExtraBoard();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard(data);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCardCount: true, resetSortType: true});
        this.#renderBoard(data);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  init = () => {
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

  get topRatedFilms() {
    const films = [...this.#filmsModel.films];
    const filteredFilms = films.sort(sortCardRating);
    const doubleCard = getDoubleCards(filteredFilms);

    if (doubleCard[0].filmInfo.totalRating) {
      return doubleCard;
    }

    return [];
  }

  get mostCommentsFilms() {
    const films = [...this.#filmsModel.films];
    const filteredFilms = films.sort(sortCardComments);
    const doubleCard = getDoubleCards(filteredFilms);

    if (doubleCard[0].comments.length) {
      return doubleCard;
    }

    return [];
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedCardCount: true});
    this.#renderBoard();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderListEmpty = () => {
    this.#listEmptyComponent = new ListEmptyView(this.#filterModel.filter);
    render(this.#listEmptyComponent, this.#boardContainer);
    remove(this.#loadingComponent);
  };

  #renderShowMoreBtn = () => {
    this.#showMoreBtnComponent = new ShowMoreBtnView();
    render(this.#showMoreBtnComponent, this.#boardComponent.element, RenderPosition.AFTEREND);
    this.#showMoreBtnComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleLoadMoreButtonClick = () => {
    const cardCount = this.films.length;
    const newRenderedCardCount = Math.min(cardCount, this.#renderedFilmCardsCount + CARDS_VIEW_STEPS);
    const films = this.films.slice(this.#renderedFilmCardsCount, newRenderedCardCount);
    this.#renderedFilmCardsCount = newRenderedCardCount;

    this.#renderCards(films);

    if (this.#renderedFilmCardsCount >= cardCount) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleModeChange = (id) => {
    this.#filmPresenterList.forEach((presenter) => {
      if (presenter.id !== id) {
        presenter.resetPopup();
      }
    });
  };

  #renderCards = (films) => films.forEach((film) => this.#renderCard(film, this.#boardComponent.element));

  #renderTopRated = () => {
    this.#topRatedComponent = new TopRatingViewContainer(this.topRatedFilms);
    render(this.#topRatedComponent, this.#filmsSectionComponent.element);
  };

  #renderTopRatedCards = (topRatedFilms) => {
    topRatedFilms.forEach((film) => this.#renderCard(film, this.#topRatedComponent.element.querySelector('.films-list__container')));
  };

  #renderMostCommented = () => {
    this.#mostCommentedCompnent = new MostCommentedView();
    render(this.#mostCommentedCompnent, this.#filmsSectionComponent.element);
  };

  #renderMostCommentsCards = (mostCommentsFilms) => {
    mostCommentsFilms.forEach((film) => this.#renderCard(film, this.#mostCommentedCompnent.element.querySelector('.films-list__container')));
  };

  #renderCard = (card, container) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#commentsModel,
      this.#handleViewAction,
      this.#handleModeChange
    );

    filmPresenter.init(card);

    if (container !== this.#boardComponent.element) {
      this.#filmPresenterList.set(`${card.id}extra`, filmPresenter);
    }

    this.#filmPresenterList.set(card.id, filmPresenter);
    console.log(this.#filmPresenterList);
  };

  #clearBoard = ({resetRenderedCardCount = false, resetSortType = false} = {}) => {
    const cardCount = this.films.length;

    this.#filmPresenterList.forEach((presenter) => presenter.destroy());
    this.#filmPresenterList.clear();

    remove(this.#sortComponent);
    remove(this.#footerComponent);
    remove(this.#listEmptyComponent);
    remove(this.#showMoreBtnComponent);
    remove(this.#topRatedComponent);
    remove(this.#mostCommentedCompnent);

    if (resetRenderedCardCount) {
      this.#renderedFilmCardsCount = CARDS_VIEW_STEPS;
    } else {
      this.#renderedFilmCardsCount = Math.min(cardCount, this.#renderedFilmCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFooter = () => {
    const cardCount = this.#filmsModel.films.length;
    this.#footerComponent = new FooterView(cardCount);
    render(this.#footerComponent, this.#boardContainer, RenderPosition.AFTEREND);
  };

  #renderBoard = (data = {}) => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const cardCount = this.films.length;
    const films = this.films.slice(0, Math.min(cardCount, this.#renderedFilmCardsCount));

    if (!cardCount) {
      this.#renderListEmpty();
      return;
    }

    remove(this.#loadingComponent);
    remove(this.#listEmptyComponent);

    this.#renderSort();
    render(this.#filmsSectionComponent, this.#boardContainer);
    render(this.#boardComponent, this.#filmsSectionComponent.element);
    this.#renderCards(films);
    this.#renderShowMoreBtn();
    this.#renderFooter();

    if (this.topRatedFilms.length) {
      this.#renderTopRated();
      this.#renderTopRatedCards(this.topRatedFilms);
    }

    if (this.mostCommentsFilms.length) {
      this.#renderMostCommented();
      this.#renderMostCommentsCards(this.mostCommentsFilms);
    }

    if (data.mode === Mode.OPEN) {
      this.#filmPresenterList.get(data.id).renderPopup(data);
    }

    if (this.#renderedFilmCardsCount >= cardCount) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #clearExtraBoard = () => {
    remove(this.#topRatedComponent);
    remove(this.#mostCommentedCompnent);
  };

  #renderExtraBoard = () => {
    if (this.topRatedFilms.length) {
      this.#renderTopRated();
      this.#renderTopRatedCards(this.topRatedFilms);
    }

    if (this.mostCommentsFilms.length) {
      this.#renderMostCommented();
      this.#renderMostCommentsCards(this.mostCommentsFilms);
    }
  };
}
