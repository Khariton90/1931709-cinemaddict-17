import FilmCardView from '../view/film-card-view';
import { remove, render, replace } from '../framework/render';
import PopupContainerView from '../view/popup/popup-container-view';
import PopupTopContainerView from '../view/popup/popup-top-container-view';
import PopupBottomContainerView from '../view/popup/popup-bottom-container-view';
import { UpdateType, UserAction } from '../consts';
import CommentView from '../view/popup/comment-view';
import NewCommentView from '../view/popup/new-comment-view';


const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN: 'OPEN'
};

export default class FilmPresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #popupComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;

  #card = null;
  #filmComments = null;
  #changeData = null;
  #mode = Mode.DEFAULT;
  #changeMode = null;

  constructor(filmListContainer, filmComments, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#filmComments = filmComments;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (card) => {
    this.#card = card;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(card);
    this.#popupComponent = new PopupContainerView();
    this.#popupTopContainerComponent = new PopupTopContainerView(card);
    this.#popupBottomContainerComponent = new PopupBottomContainerView(this.#filmComments.length);

    this.#filmComponent.setHandleWatchlistClick(this.#handleWatchlistClick);
    this.#filmComponent.setHandleAlreadyWatchedClick(this.#handleAlreadyWatchedClick);
    this.#filmComponent.setHandleFavoritesClick(this.#handleFavoritesClick);

    this.#filmComponent.setClickHandler(this.#renderPopup);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (prevFilmComponent !== null) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.OPEN) {
      this.#renderPopup();
    }

    if (this.#mode === Mode.DEFAULT) {
      this.#removePopup();
    }

    remove(prevPopupComponent);
    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  };

  resetPopup = () => {
    if (this.#mode !== Mode.DEFAULT) {
      remove(this.#popupComponent);
      this.#mode = Mode.DEFAULT;
    }

  };

  #removePopup = () => {
    remove(this.#popupComponent);

    this.#mode = Mode.DEFAULT;

    remove(this.#popupBottomContainerComponent);
  };

  #renderPopup = () => {
    this.#changeMode();
    this.#mode = Mode.OPEN;

    render(this.#popupComponent, this.#filmListContainer);
    render(this.#popupTopContainerComponent, this.#popupComponent.element.querySelector('.film-details__inner'));
    render(this.#popupBottomContainerComponent, this.#popupComponent.element.querySelector('.film-details__inner'));

    this.#popupComponent.setKeyDownHandler(this.#removePopup);
    this.#popupComponent.setClickHandler(this.#removePopup);

    this.#popupTopContainerComponent.setHandleWatchlistClick(this.#handleWatchlistClick);
    this.#popupTopContainerComponent.setHandleAlreadyWatchedClick(this.#handleAlreadyWatchedClick);
    this.#popupTopContainerComponent.setHandleFavoritesClick(this.#handleFavoritesClick);

    this.#renderCommentsList();

    this.#renderNewCommentComponent();
  };

  #renderCommentsList = () => {
    this.#filmComments.forEach((comment) => this.#renderComment(comment));
  };

  #renderComment = (comment) => {
    const commentComponent = new CommentView(comment);
    render(commentComponent, this.#popupBottomContainerComponent.element.querySelector('.film-details__comments-list'));
  };

  #renderNewCommentComponent = () => {
    const newCommentComponent = new NewCommentView();
    render(newCommentComponent, this.#popupBottomContainerComponent.element);

    newCommentComponent.setHandleAddCommentKeyPress(this.#handleAddCommentKeyPress);
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card, userDetails: {...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist}});
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card, userDetails: {...this.#card.userDetails, alreadyWatched: !this.#card.userDetails.alreadyWatched}});
  };

  #handleFavoritesClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card, userDetails: {...this.#card.userDetails, favorite: !this.#card.userDetails.favorite}});
  };

  #handleAddCommentKeyPress = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      comment
    );
  };
}
