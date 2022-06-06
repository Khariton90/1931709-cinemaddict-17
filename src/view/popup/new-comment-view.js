import { nanoid } from 'nanoid';
import he from 'he';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createNewCommentTemplate = (state) => {
  const { emotion } = state;

  const emojis = ['smile','sleeping','puke','angry'];

  const emojiListTemplate = emojis.map((emoji) => {
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
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>
      <div class="film-details__emoji-list">${emojiListTemplate}</div>
    </div>`
  );};

export default class NewCommentView extends AbstractStatefulView {
  get template() {
    return createNewCommentTemplate(this._state);
  }

  constructor() {
    super();
    this._state = NewCommentView.stateToFilm();

    this.#setInnerHandlers();
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  static stateToFilm = () => ({
    id: null,
    author: null,
    comment: null,
    date: null,
    emotion: null
  });

  static filmToState = (state) => {
    const comment = {...state};

    return comment;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#setCommentEmojiHandler);
    this.element.querySelector('.film-details__comment-input').value = this._state.comment;
    this.element.addEventListener('keydown', this.#handleAddComment);
  };


  #setCommentEmojiHandler = (evt) => {
    if (evt.target.tagName !== 'IMG') {
      return;
    }

    const fieldId = `#${evt.target.parentNode.htmlFor}`;
    this.element.querySelector(fieldId).checked = true;

    this.updateElement({
      emotion: this.element.querySelector(fieldId).value,
      comment: this.element.querySelector('.film-details__comment-input').value,
    });
  };

  setHandleAddCommentKeyPress = (callback) => {
    this._callback.addCommentKeyPress = callback;
    this.element.addEventListener('keypress', this.#handleAddComment);
  };

  #handleAddComment = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && evt.ctrlKey) {
      evt.preventDefault();

      this.updateElement({
        id: nanoid(),
        comment: he.encode(this.element.querySelector('.film-details__comment-input').value),
      });

      const state = NewCommentView.filmToState(this._state);
      this._callback.addCommentKeyPress(state);
    }

  };
}

