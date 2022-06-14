import AbstractStatefulView from '../../framework/view/abstract-stateful-view';

const createPopupFormInnerViewTemplate = () => (
  '<form class="film-details__inner" action="" method="get"></form>'
);

export default class PopupFormInnerView extends AbstractStatefulView {
  constructor() {
    super();
  }

  get template() {
    return createPopupFormInnerViewTemplate();
  }
}

