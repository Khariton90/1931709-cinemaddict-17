import AbstractView from '../../framework/view/abstract-view';

const createFilmDetailsInnerView = () => (
  '<form class="film-details__inner" action="" method="get"></form>'
);

export default class FilmDetailInnerView extends AbstractView {
  get template() {
    return createFilmDetailsInnerView(this.props);
  }
}


