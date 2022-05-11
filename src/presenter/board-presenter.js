import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilterView from '../view/filter-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmDetailsTopView from '../view/film-details/film-details-top-view';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom-view';
import { CommentView } from '../view/film-details/comment-view';

export default class BoardPresenter {
  boardComponent = new FilmsListContainerView();
  popupComponent = new FilmDetailsPopupView();

  init = (boardContainer, filmsModel) => {
    this.boardContainer = boardContainer;

    this.filmsModel = filmsModel;
    this.boardsFilms = [...this.filmsModel.getFilms()];
    this.boardComments = [...this.filmsModel.getComments()];

    render(new FilterView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(new ShowMoreBtnView(), this.boardContainer);

    for (let i = 0; i < this.boardsFilms.length; i++) {
      render(new FilmCardView(this.boardsFilms[i]), this.boardComponent.getElement());
    }

    render(this.popupComponent, document.body);
    render(new FilmDetailsTopView(this.boardsFilms[0]), document.querySelector('.film-details__inner'));
    render(new FilmDetailsBottomView(this.boardsFilms[0]), document.querySelector('.film-details__inner'));

    const filteredComments = this.boardComments.filter((comment) => this.boardsFilms[0].comments.includes(comment.id));
    filteredComments.forEach((el) => render(new CommentView(el), document.querySelector('.film-details__comments-list')));

  };
}
