import AbstractView from '../../framework/view/abstract-view';
import { getHumanizeDate } from '../../utils';

const createCommentViewTemplate = (popupComment) => {
  const { emotion, comment, author, date } = popupComment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getHumanizeDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );};

export default class CommentView extends AbstractView {
  #commentData = null;

  get template() {
    return createCommentViewTemplate(this.#commentData);
  }

  constructor(commentData) {
    super();
    this.#commentData = commentData;
  }

  setHandleDeleteCommentClick = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#handleDeleteComment);
  };

  #handleDeleteComment = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this._callback.deleteCommentClick();
  };
}

