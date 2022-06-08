import AbstractView from '../../framework/view/abstract-view';
import { getCommentTime } from '../../utils';

const createCommentViewTemplate = (popupComment) => {
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
          <button class="film-details__comment-delete" data-id=${id}>Delete</button>
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
    this._callback.deleteCommentClick(evt.target.dataset.id);
  };
}

