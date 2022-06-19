import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';

const createMostCommentedViewContainerTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`
);

export class MostCommentedViewContainer extends AbstractStatefulView {
  get template() {
    return createMostCommentedViewContainerTemplate();
  }
}
