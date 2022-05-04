import { render } from '../render';
import FilmCardView from '../view/film-card-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilterView from '../view/filter-view';
import ShowMoreBtnView from '../view/show-more-btn-view';

export default class BoardPresenter {
  boardComponent = new FilmsListContainerView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(new FilterView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(new ShowMoreBtnView(), this.boardContainer);

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.boardComponent.getElement());
    }
  };
}
