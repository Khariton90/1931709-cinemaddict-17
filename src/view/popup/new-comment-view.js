import he from 'he';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { EMOTIONS } from '../../consts';

const createNewCommentTemplate = (state) => {
  const { emotion, isDisabled } = state;

  const emojiListTemplate = EMOTIONS.map((emoji) => {
    const checked = emoji === emotion ? 'checked' : '';

    return(
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
        <label class="film-details__emoji-label" for="emoji-${emoji}">
          <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
        </label>`
    );
  }).join('');

  return (
    `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
        ${emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : ''}
      </div>
      <label class="film-details__comment-label">
       <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}></textarea>
      </label>
      <div class="film-details__emoji-list">${emojiListTemplate}</div>
    </div>`
  );
};

export default class NewCommentView extends AbstractStatefulView {
  constructor() {
    super();
    this.#setInnerHandlers();
  }

  get template() {
    return createNewCommentTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#setCommentEmojiHandler);
    this.element.querySelector('.film-details__comment-input').value = this._state.comment || '';
    this.element.addEventListener('keydown', this.#handleAddComment);
  };

  setHandleAddCommentKeyPress = (callback) => {
    this._callback.addCommentKeyPress = callback;
    this.element.addEventListener('keypress', this.#handleAddComment);
  };

  #setCommentEmojiHandler = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const fieldId = `#${evt.target.parentNode.htmlFor}`;
    this.element.querySelector(fieldId).checked = true;

    this.updateElement({
      comment: this.element.querySelector('.film-details__comment-input').value,
      emotion: this.element.querySelector(fieldId).value,
    });
  };

  #handleAddComment = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && evt.ctrlKey) {
      evt.preventDefault();

      if (!this._state.emotion) {
        this.shake();
        return;
      }

      const fieldValue = this.element.querySelector('.film-details__comment-input').value;

      this.updateElement({
        comment: he.encode(fieldValue),
        isDisabled: true,
      });

      this.element.querySelector('.film-details__comment-input').value = fieldValue;
      this._callback.addCommentKeyPress(NewCommentView.filmToState(this._state));
    }
  };

  static filmToState = (state) => {
    const comment = {...state};
    delete comment.isDisabled;

    return comment;
  };
}

