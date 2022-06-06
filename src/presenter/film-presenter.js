import FilmCardView from '../view/film-card-view';
import { remove, render, replace } from '../framework/render';
import PopupContainerView from '../view/popup/popup-container-view';
import PopupTopContainerView from '../view/popup/popup-top-container-view';
import PopupBottomContainerView from '../view/popup/popup-bottom-container-view';
import { Mode, UpdateType, UserAction } from '../consts';
import CommentView from '../view/popup/comment-view';
import NewCommentView from '../view/popup/new-comment-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #popupComponent = null;
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #newCommentComponent = null;

  #card = null;
  #commentsModel = null;
  #changeData = null;
  #mode = Mode.DEFAULT;
  #changeMode = null;

  constructor(filmListContainer, commentsModel, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  get comments() {
    return [...this.#commentsModel.comments].filter((comment) => this.#card.comments.includes(comment.id));
  }

  init = (card) => {
    this.#card = card;
    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;
    this.#filmComponent = new FilmCardView(this.#card, this.comments.length);

    this.#filmComponent.setHandleWatchlistClick(this.#handleWatchlistClick);
    this.#filmComponent.setHandleAlreadyWatchedClick(this.#handleAlreadyWatchedClick);
    this.#filmComponent.setHandleFavoritesClick(this.#handleFavoritesClick);
    this.#filmComponent.setClickHandler(this.renderPopup);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (prevFilmComponent !== null) {
      replace(this.#filmComponent, prevFilmComponent);
    }


    if (this.#mode === Mode.OPEN) {
      this.renderPopup();
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
      remove(this.#popupBottomContainerComponent);
      remove(this.#popupTopContainerComponent);
      this.#mode = Mode.DEFAULT;
    }

  };

  #removePopup = () => {
    remove(this.#popupComponent);
    remove(this.#popupBottomContainerComponent);
    this.#mode = Mode.DEFAULT;
  };

  renderPopup = () => {
    this.#changeMode();
    this.#mode = Mode.OPEN;

    this.#popupComponent = new PopupContainerView();
    render(this.#popupComponent, this.#filmListContainer);

    this.#popupTopContainerComponent = new PopupTopContainerView(this.#card);
    this.#popupBottomContainerComponent = new PopupBottomContainerView(this.comments.length);
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
    this.comments.forEach((comment) => this.#renderComment(comment));
  };

  #renderComment = (comment) => {
    const commentComponent = new CommentView(comment);
    render(commentComponent, this.#popupBottomContainerComponent.element.querySelector('.film-details__comments-list'));
    commentComponent.setHandleDeleteCommentClick(this.#handleDeleteCommentClick);
  };

  #renderNewCommentComponent = () => {
    this.#newCommentComponent = new NewCommentView();
    render(this.#newCommentComponent, this.#popupBottomContainerComponent.element);

    this.#newCommentComponent.setHandleAddCommentKeyPress(this.#handleAddCommentKeyPress);
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...{...this.#card, userDetails: {...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist}}, mode: this.#mode});
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...{...this.#card, userDetails: {...this.#card.userDetails, alreadyWatched: !this.#card.userDetails.alreadyWatched}}, mode: this.#mode});
  };

  #handleFavoritesClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...{...this.#card, userDetails: {...this.#card.userDetails, favorite: !this.#card.userDetails.favorite}}, mode: this.#mode});
  };

  #handleAddCommentKeyPress = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      { card: {...this.#card, comments: [...this.#card.comments, comment.id]}, comment: comment }
    );
  };

  #handleDeleteCommentClick = (comment) => {
    const comments = this.#card.comments.filter((item) => item !== comment);
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { card: {...this.#card, comments: [...comments]}, comments: {id: comment} }
    );
  };
}
