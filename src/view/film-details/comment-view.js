import { createElement } from '../../render';

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
      <span class="film-details__comment-day">${date}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`
  );
};

export class CommentView {
  #element = null;
  constructor(popupComment) {
    this.popupComment = popupComment;
  }

  get template() {
    return createCommentViewTemplate(this.popupComment);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}