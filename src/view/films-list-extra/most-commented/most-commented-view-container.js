import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';

const createMostCommentedViewTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container"></div>
  </section>
</section>`
);

export class MostCommentedView extends AbstractStatefulView {
  get template() {
    return createMostCommentedViewTemplate();
  }
}
