import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { getCommentTime } from '../../utils';

const TIME_OUT = 300;

const createCommentViewTemplate = (popupComment, {isDisabled, isDeliting}) => {
  const { emotion, comment, author, date, id } = popupComment;
  const dateNow = new Date().toISOString();
  const img = emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : '<img src="./images/emoji/sleeping.png" width="55" height="55" alt="emoji-sleeping">';

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        ${img}
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author || 'Anonym'}</span>
          <span class="film-details__comment-day">${date ? getCommentTime(date) : getCommentTime(dateNow)}</span>
          <button class="film-details__comment-delete" data-id=${id} ${isDisabled ? 'disabled' : ''}>${isDeliting ? 'Deleting': 'Delete'}</button>
        </p>
      </div>
    </li>`
  );};

export default class CommentView extends AbstractStatefulView {
  #commentData = null;

  get template() {
    return createCommentViewTemplate(this.#commentData, this._state);
  }

  constructor(commentData) {
    super();
    this.#commentData = commentData;
  }

  _restoreHandlers = () => {
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#handleDeleteComment);
  };

  setHandleDeleteCommentClick = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#handleDeleteComment);
  };

  setHandleShakeDeleting = (aborting) => {
    if (this._state.isDeliting === aborting.isDeleting) {
      this.shake();

      setTimeout(() => this.updateElement({
        isDeliting: false,
        isDisabled: false
      }), TIME_OUT);
    }

  };

  #handleDeleteComment = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this.updateElement({
      isDisabled: true,
      isDeliting: true
    });

    this._callback.deleteCommentClick(evt.target.dataset.id);
  };

}

