import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilterView from '../view/filter-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmDetailsTopView from '../view/film-details/film-details-top-view';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom-view';
import { CommentView } from '../view/film-details/comment-view';
import { CARDS_VIEW_STEPS } from '../consts';
import ListEmptyView from '../view/list-empty-view';

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #boardComponent = new FilmsListContainerView();
  #popupComponent = new FilmDetailsPopupView();
  #renderedCardsViewCount = CARDS_VIEW_STEPS;
  #showMoreBtnComponent = new ShowMoreBtnView();

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
    render(new FilterView(), this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);

    if (this.boardsFilms.length === 0) {
      render(new ListEmptyView(), this.#boardContainer);
    } else {
      for (let i = 0; i < Math.min(this.boardsFilms.length, CARDS_VIEW_STEPS); i++) {
        this.#renderCards(this.boardsFilms[i]);
        this.#showMoreBtnComponent.element.addEventListener('click', this.#handleLoadMoreButtonClick);
      }

      render(this.#showMoreBtnComponent, this.#boardContainer);
    }
  };

  #handleLoadMoreButtonClick = (evt) => {
    evt.preventDefault();

    this.boardsFilms
      .slice(this.#renderedCardsViewCount, this.#renderedCardsViewCount + 5)
      .forEach((film) => this.#renderCards(film));

    this.#renderedCardsViewCount += CARDS_VIEW_STEPS;

    if (this.#renderedCardsViewCount >= this.boardsFilms.length) {
      this.#showMoreBtnComponent.element.remove();
      this.#showMoreBtnComponent.removeElement();
    }
  };

  #renderCards = (card) => {
    const filmCardComponent = new FilmCardView(card);
    render(filmCardComponent, this.#boardComponent.element);

    filmCardComponent.element.addEventListener('click', () => {
      if (document.body.classList.contains('hide-overflow')) {
        this.#removePopup();
        this.#renderPopup(card);
      } else {
        this.#renderPopup(card);
      }
    });
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #renderPopup = (film) => {
    document.addEventListener('keydown', this.#onEscKeyDown);

    render(this.#popupComponent, document.body);
    render(new FilmDetailsTopView(film), document.querySelector('.film-details__inner'));
    render(new FilmDetailsBottomView(film), document.querySelector('.film-details__inner'));

    const filteredComments = this.boardComments.filter((comment) => film.comments.includes(comment.id));
    filteredComments.forEach((el) => render(new CommentView(el), document.querySelector('.film-details__comments-list')));

    document.body.classList.add('hide-overflow');
    this.#popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      this.#removePopup();
    });
  };

  #removePopup = () => {
    document.body.querySelector('.film-details').remove();
    document.body.classList.remove('hide-overflow');
    this.#popupComponent.removeElement();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };
}
