import AbstractView from '../framework/view/abstract-view';

const filterTitleList = {
  'All movies': 'There are no movies in our database',
  'Watchlist': 'There are no movies to watch now',
  'History': 'There are no watched movies now',
  'Favorites': 'There are no favorite movies now'
};

const createListEmptyViewTemplate = (filterType) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${filterTitleList[filterType]}</h2>
    </section>
  </section>`
);

export default class ListEmptyView extends AbstractView {
  #filterType = 'All movies';

  get template() {
    return createListEmptyViewTemplate(this.#filterType);
  }

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }
}

