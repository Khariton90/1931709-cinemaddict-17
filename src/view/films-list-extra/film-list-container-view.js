import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';

const createFilmListContainerViewTemplate = () => (
  '<div class="films-list__container"></div>'
);

export class FilmListContainerView extends AbstractStatefulView {
  get template() {
    return createFilmListContainerViewTemplate();
  }
}
