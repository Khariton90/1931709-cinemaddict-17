import FilmCardView from '../view/film-card-view';
import FilmsListContainerView from '../view/films-list-container-view';
import SortView from '../view/sort-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmDetailsTopView from '../view/film-details/film-details-top-view';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom-view';
import { CARDS_VIEW_STEPS } from '../consts';
import ListEmptyView from '../view/list-empty-view';
import { remove, render } from '../framework/render';
import FilmDetailInnerView from '../view/film-details/film-details-inner-view';

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #boardComponent = new FilmsListContainerView();
  #popupComponent = new FilmDetailsPopupView();
  #renderedCardsViewCount = CARDS_VIEW_STEPS;
  #formDetailInnerComponent = new FilmDetailInnerView();
  #showMoreBtnComponent = new ShowMoreBtnView();
  _popup = false;

  get popup() {
    return this._popup;
  }

  set popup(value) {
    this._popup = value;
  }

  constructor(boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.boardsFilms = [...this.#filmsModel.films];
    this.boardComments = [...this.#filmsModel.comments];

    this.#renderBoard();
  };

  #renderBoard = () => {
    render(new SortView(), this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);

    if (!this.boardsFilms.length) {
      render(new ListEmptyView(), this.#boardContainer);
    } else {
      for (let i = 0; i < Math.min(this.boardsFilms.length, CARDS_VIEW_STEPS); i++) {
        this.#renderCards(this.boardsFilms[i]);
        this.#showMoreBtnComponent.setClickHandler(this.#handleLoadMoreButtonClick);
      }

      render(this.#showMoreBtnComponent, this.#boardContainer);
    }
  };

  #handleLoadMoreButtonClick = () => {
    this.boardsFilms
      .slice(this.#renderedCardsViewCount, this.#renderedCardsViewCount + CARDS_VIEW_STEPS)
      .forEach((film) => this.#renderCards(film));

    this.#renderedCardsViewCount += CARDS_VIEW_STEPS;

    if (this.#renderedCardsViewCount >= this.boardsFilms.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #renderCards = (card) => {
    const filmCardComponent = new FilmCardView(card);
    render(filmCardComponent, this.#boardComponent.element);

    filmCardComponent.setClickHandler(() => {
      if (this.popup) {
        this.#removePopup();
      }

      this.#renderPopup(card);
    });
  };

  #renderPopup = (film) => {
    const { comments } = film;

    this.popup = true;
    render(this.#popupComponent, document.body);
    render(this.#formDetailInnerComponent, this.#popupComponent.element);
    render(new FilmDetailsTopView(film), this.#formDetailInnerComponent.element);
    this.#renderFilmComments(comments);

    this.#popupComponent.setKeyDownHandler(this.#removePopup);
    this.#popupComponent.setClickHandler(this.#removePopup);
  };

  #renderFilmComments = (comments) => {
    const filteredComments = this.boardComments.filter((comment) => comments.includes(comment.id));
    const filmDetailBottomContainer = new FilmDetailsBottomView(filteredComments);

    render(filmDetailBottomContainer, this.#formDetailInnerComponent.element);
  };

  #removePopup = () => {
    this.popup = false;
    remove(this.#popupComponent);
    remove(this.#formDetailInnerComponent);
  };
}
