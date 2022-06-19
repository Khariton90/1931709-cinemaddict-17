import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';

const createTopRatingViewTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top Rated</h2>
    <div class="films-list__container"></div>
  </section>
</section>`
);

export class TopRatingViewContainer extends AbstractStatefulView {
  get template() {
    return createTopRatingViewTemplate();
  }

  constructor() {
    super();
  }
}
