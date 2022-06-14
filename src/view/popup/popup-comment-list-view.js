import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createPopupCommentListViewTemplate = () => (
  '<ul class="film-details__comments-list"></ul>'
);

export default class PopupCommentListView extends AbstractStatefulView {
  get template() {
    return createPopupCommentListViewTemplate();
  }
}

