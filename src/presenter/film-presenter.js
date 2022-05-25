import FilmCardView from '../view/film-card-view';
import { remove, render, RenderPosition, replace } from '../framework/render';
import PopupContainerView from '../view/popup/popup-container-view';
import PopupTopContainerView from '../view/popup/popup-top-container-view';
import PopupBottomContainerView from '../view/popup/popup-bottom-container-view';

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
    this.#popupBottomContainerComponent = new PopupBottomContainerView(card, this.#filmComments);

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
  };

  #renderPopup = () => {
    this.#changeMode();

    this.#mode = Mode.OPEN;
    render(this.#popupComponent, this.#filmListContainer, RenderPosition.AFTEREND);
    render(this.#popupTopContainerComponent, this.#popupComponent.element);
    render(this.#popupBottomContainerComponent, this.#popupComponent.element);

    this.#popupComponent.setKeyDownHandler(this.#removePopup);
    this.#popupComponent.setClickHandler(this.#removePopup);

    this.#popupTopContainerComponent.setHandleWatchlistClick(this.#handleWatchlistClick);
    this.#popupTopContainerComponent.setHandleAlreadyWatchedClick(this.#handleAlreadyWatchedClick);
    this.#popupTopContainerComponent.setHandleFavoritesClick(this.#handleFavoritesClick);

  };

  #handleWatchlistClick = () => {
    this.#changeData({...this.#card, userDetails: {...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist}});
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#card, userDetails: {...this.#card.userDetails, alreadyWatched: !this.#card.userDetails.alreadyWatched}});
  };

  #handleFavoritesClick = () => {
    this.#changeData({...this.#card, userDetails: {...this.#card.userDetails, favorite: !this.#card.userDetails.favorite}});
  };
}
