import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilterView from '../view/filter-view';
import ShowMoreBtnView from '../view/show-more-btn-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmDetailsTopView from '../view/film-details/film-details-top-view';
import FilmDetailsBottomView from '../view/film-details/film-details-bottom-view';
import { CommentView } from '../view/film-details/comment-view';
import { isEscapeKey } from '../utils';

export default class BoardPresenter {
  boardComponent = new FilmsListContainerView();
  popupComponent = new FilmDetailsPopupView();

  init = (boardContainer, filmsModel) => {
    this.boardContainer = boardContainer;

    this.filmsModel = filmsModel;
    this.boardsFilms = [...this.filmsModel.getFilms()];
    this.boardComments = [...this.filmsModel.getComments()];

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#removePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    render(new FilterView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(new ShowMoreBtnView(), this.boardContainer);

    for (let i = 0; i < this.boardsFilms.length; i++) {
      render(new FilmCardView(this.boardsFilms[i]), this.boardComponent.element);
      this.boardComponent.element.querySelectorAll('.film-card')[i].addEventListener('click', () => {
        this.#renderPopup(this.boardsFilms[i]);
        document.addEventListener('keydown', onEscKeyDown);
      });
    }
  };

  #renderPopup = (film) => {
    render(this.popupComponent, document.body);
    render(new FilmDetailsTopView(film), document.querySelector('.film-details__inner'));
    render(new FilmDetailsBottomView(film), document.querySelector('.film-details__inner'));
    const filteredComments = this.boardComments.filter((comment) => film.comments.includes(comment.id));
    filteredComments.forEach((el) => render(new CommentView(el), document.querySelector('.film-details__comments-list')));
    document.body.classList.add('hide-overflow');
    this.popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', this.#removePopup);

  };

  #removePopup = () => {
    document.body.querySelector('.film-details').remove();
    document.body.classList.remove('hide-overflow');
    this.popupComponent.removeElement();
  };
}
