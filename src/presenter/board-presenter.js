import FilmsListContainerView from '../view/films-list-container-view';
import SortView from '../view/sort-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import { CARDS_VIEW_STEPS } from '../consts';
import ListEmptyView from '../view/list-empty-view';
import { remove, render } from '../framework/render';
import FilmPresenter from './film-presenter';
import { updateItem } from '../utils';

export default class BoardPresenter {
  #renderedFilmCardsCount = CARDS_VIEW_STEPS;
  #filmsModel = null;

  #boardContainer = null;
  #boardComponent = new FilmsListContainerView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  #listEmptyComponent = new ListEmptyView();
  #sortComponent = new SortView();

  #boardFilms = [];
  #boardComments = [];
  #filmPresenter = new Map();


  constructor(boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#boardFilms = [...this.#filmsModel.films];
    this.#boardComments = [...this.#filmsModel.comments];

    this.#renderBoard();
  };

  #renderSort = () => render(this.#sortComponent, this.#boardContainer);

  #renderListEmpty = () => render(this.#listEmptyComponent, this.#boardContainer);

  #renderShowMoreBtn = () => {
    render(this.#showMoreBtnComponent, this.#boardContainer);
    this.#showMoreBtnComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderCards(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + CARDS_VIEW_STEPS);

    this.#renderedFilmCardsCount += CARDS_VIEW_STEPS;

    if (this.#renderedFilmCardsCount >= this.#boardFilms.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleCardChange = (updatedCard) => {
    this.#boardFilms = updateItem(this.#boardFilms, updatedCard);
    this.#filmPresenter.get(updatedCard.id).init(updatedCard);
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #renderCards = (from , to) => this.#boardFilms.slice(from , to).forEach((film) => this.#renderCard(film));

  #renderCard = (card) => {
    const filmPresenter = new FilmPresenter(this.#boardComponent.element, this.#boardComments, this.#handleCardChange, this.#handleModeChange);
    filmPresenter.init(card);
    this.#filmPresenter.set(card.id, filmPresenter);
  };


  #renderBoard = () => {
    this.#renderSort();
    render(this.#boardComponent, this.#boardContainer);

    if (!this.#boardFilms.length) {
      this.#renderListEmpty();
      return;
    }

    for (let i = 0; i < Math.min(this.#boardFilms.length, CARDS_VIEW_STEPS); i++) {
      this.#renderCard(this.#boardFilms[i]);
    }

    this.#renderShowMoreBtn();
  };

  #clearFilmListPresenter = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCardsCount = CARDS_VIEW_STEPS;
    remove(this.#showMoreBtnComponent);
  };
}
