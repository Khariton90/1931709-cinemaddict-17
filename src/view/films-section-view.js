import AbstractView from '../framework/view/abstract-view';

const createFilmsSectionTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsSectionView extends AbstractView {
  get template() {
    return createFilmsSectionTemplate();
  }
}
