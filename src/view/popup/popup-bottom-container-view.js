import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createPopupBottomContainerViewTemplate = (length) => (
  `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">${length ? 'Comments' : 'Add New Comment'} <span class="film-details__comments-count">${length || ''}</span></h3>
        <ul class="film-details__comments-list">

        </ul>
      </section>
    </div>`);

export default class PopupBottomContainerView extends AbstractStatefulView {
  #length = null;

  get template() {
    return createPopupBottomContainerViewTemplate(this.#length);
  }

  constructor(length) {
    super();
    this.#length = length;
  }
}

