import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { getHumanizeDate } from '../../utils';

const createPopupBottomContainerViewTemplate = (film) => {
  const { filteredComments, commentEmotion } = film;

  const commentsTemplate = filteredComments.map((popupComment) => {
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
  </li>`);
  }).join('');

  const emojis = ['smile','sleeping','puke','angry'];
  const emojiListTemplate = emojis.map((emoji) => {
    const checked = emoji === commentEmotion ? 'checked' : '';

    return(
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
        <label class="film-details__emoji-label" for="emoji-${emoji}">
           <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`
    );
  }).join('');

  return(
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filteredComments.length}</span></h3>
         <ul class="film-details__comments-list">
          ${commentsTemplate}
       </ul>
  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${commentEmotion ? `<img src="./images/emoji/${commentEmotion}.png" width="55" height="55" alt="emoji">` : ''}
    </div>
      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>
    <div class="film-details__emoji-list">${emojiListTemplate}</div>
      </div>
    </section>
  </div>
</form>
</section>`
  );
};

export default class PopupBottomContainerView extends AbstractStatefulView {
  get template() {
    return createPopupBottomContainerViewTemplate(this._state);
  }

  constructor(film, comments) {
    super();

    this._state = PopupBottomContainerView.stateToFilm(film, comments);

    this.#setInnerHandlers();
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  static stateToFilm = (film, comments) => ({
    ...film,
    filteredComments: [...comments].filter((comment) => film.comments.includes(comment.id)),
    commentEmotion: null,
  });

  static filmToState = (state) => {
    const film = {...state};

    delete film.filteredComments;

    return film;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#setCommentEmojiHandler);
    this.element.scrollTo({top: this.element.scrollHeight});
  };

  #setCommentEmojiHandler = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const fieldId = `#${evt.target.parentNode.htmlFor}`;
    this.element.querySelector(fieldId).checked = true;

    this.updateElement({
      commentEmotion: this.element.querySelector(fieldId).value,
    });
  };
}

