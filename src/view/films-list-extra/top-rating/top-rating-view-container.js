import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';

const createTopRatingViewContainerTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top Rated</h2>
  </section>`
);

export class TopRatingViewContainer extends AbstractStatefulView {
  get template() {
    return createTopRatingViewContainerTemplate();
  }
}
