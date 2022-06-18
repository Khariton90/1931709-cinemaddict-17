import FilmCardView from '../view/film-card-view';
import { remove, render, replace } from '../framework/render';
import PopupContainerView from '../view/popup/popup-container-view';
import PopupTopContainerView from '../view/popup/popup-top-container-view';
import PopupBottomContainerView from '../view/popup/popup-bottom-container-view';
import { Aborting, Disabled, Mode, UpdateType, UserAction } from '../consts';
import CommentView from '../view/popup/comment-view';
import NewCommentView from '../view/popup/new-comment-view';
import PopupFormInnerView from '../view/popup/popup-form-inner-view';
import PopupCommentListView from '../view/popup/popup-comment-list-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #popupComponent = null;
  #popupFormInnerComponent = new PopupFormInnerView();
  #popupTopContainerComponent = null;
  #popupBottomContainerComponent = null;
  #popupCommentListComponent = new PopupCommentListView();
  #newCommentComponent = null;

  #card = null;
  #commentsModel = null;
  #changeData = null;
  #mode = Mode.DEFAULT;
  #changeMode = null;
  #commentsList = [];

  constructor(filmListContainer, commentsModel, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  get mode() {
    return this.#mode;
  }

  set mode(value){
    this.#mode = value;
  }

  init = (card, container = this.#filmListContainer) => {
    this.#filmListContainer = container;
    this.#card = card;
    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;
    this.#filmComponent = new FilmCardView(this.#card);

    this.#filmComponent.setHandleWatchlistClick(this.#handleWatchlistClick);
    this.#filmComponent.setHandleAlreadyWatchedClick(this.#handleAlreadyWatchedClick);
    this.#filmComponent.setHandleFavoritesClick(this.#handleFavoritesClick);
    this.#filmComponent.setClickHandler(this.#handleClickOpenPopup);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this.#filmComponent,  container);
      return;
    }

    if (prevFilmComponent !== null) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.DEFAULT) {
      this.resetPopup();
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
      remove(this.#popupFormInnerComponent);
      remove(this.#popupTopContainerComponent);
      remove(this.#popupBottomContainerComponent);
      remove(this.#popupCommentListComponent);
      this.#commentsList = [];
      this.#mode = Mode.DEFAULT;
    }
  };

  #handleClickOpenPopup = async () => {
    this.#commentsModel.init(this.#card)
      .finally(() => this.renderPopup(this.#card));
  };

  setAbortingSaving = () => {
    const resetFormState = () => {
      this.#newCommentComponent.updateElement(Aborting);
    };

    if (this.#mode === Mode.OPEN) {
      this.#newCommentComponent.shake(resetFormState);
    }
  };

  setAbortingUpdated = () => {
    const resetFormState = () => {
      this.#popupTopContainerComponent.updateElement(Aborting);
    };

    const resetCardState = () => {
      this.#filmComponent.updateElement(Aborting);
    };

    if (this.#mode === Mode.OPEN) {
      this.#popupTopContainerComponent.shake(resetFormState);
      return;
    }

    this.#filmComponent.shake(resetCardState);
  };

  setAbortingDeliting = () => {
    this.#commentsList.forEach((comment) => comment.setHandleShakeDeleting(Disabled));
  };

  setScroll = (action) => {
    if ((action === UserAction.ADD_COMMENT) || (action === UserAction.DELETE_COMMENT)) {
      this.#popupComponent.element.scrollTo({top: this.#popupComponent.element.scrollHeight, behavior: 'smooth'});
    }
  };

  renderPopup = (card = {}) => {
    this.#card = card;

    this.#changeMode(this.#card.id);
    this.#mode = Mode.OPEN;

    this.#popupComponent = new PopupContainerView();

    render(this.#popupComponent, this.#filmListContainer);

    this.#popupTopContainerComponent = new PopupTopContainerView(this.#card);
    this.#popupBottomContainerComponent = new PopupBottomContainerView(this.comments.length);
    render(this.#popupFormInnerComponent, this.#popupComponent.element);
    render(this.#popupTopContainerComponent, this.#popupFormInnerComponent.element);
    render(this.#popupBottomContainerComponent, this.#popupFormInnerComponent.element);
    render(this.#popupCommentListComponent, this.#popupBottomContainerComponent.element);

    this.#popupComponent.setKeyDownHandler(this.resetPopup);
    this.#popupComponent.setClickHandler(this.resetPopup);

    this.#popupTopContainerComponent.setHandleWatchlistClick(this.#handleWatchlistClick);
    this.#popupTopContainerComponent.setHandleAlreadyWatchedClick(this.#handleAlreadyWatchedClick);
    this.#popupTopContainerComponent.setHandleFavoritesClick(this.#handleFavoritesClick);

    this.#renderComments();
    this.#renderNewComment();
  };

  #renderComments = () => this.comments.forEach((comment) => this.#renderComment(comment));

  #renderComment = (comment) => {
    const commentComponent = new CommentView(comment);
    render(commentComponent, this.#popupCommentListComponent.element);
    commentComponent.setHandleDeleteCommentClick(this.#handleDeleteCommentClick);
    this.#commentsList.push(commentComponent);
  };

  #renderNewComment = () => {
    this.#newCommentComponent = new NewCommentView();
    render(this.#newCommentComponent, this.#popupBottomContainerComponent.element);

    this.#newCommentComponent.setHandleAddCommentKeyPress(this.#handleAddCommentKeyPress);
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#card,
        userDetails: {...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist},
        mode: this.#mode
      });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#card,
        userDetails: {...this.#card.userDetails,
          alreadyWatched: !this.#card.userDetails.alreadyWatched
        },
        mode: this.#mode
      });
  };

  #handleFavoritesClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#card,
        userDetails: {...this.#card.userDetails, favorite: !this.#card.userDetails.favorite},
        mode: this.#mode
      });
  };

  #handleAddCommentKeyPress = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {...this.#card,
        comment: {...comment},
        mode: this.#mode
      });
  };

  #handleDeleteCommentClick = (comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {...this.#card,
        comments: comment,
        mode: this.#mode
      });
  };
}
