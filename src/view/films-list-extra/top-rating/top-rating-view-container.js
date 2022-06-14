import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';


const createTopRatingContainerView = (topRated) => {
    console.log(topRated);
    return(
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">

    </div>
  </section>`
  );
};


export class TopRatingViewContainer extends AbstractStatefulView {
  #topRated = null;

  get template() {
    return createTopRatingContainerView(this.#topRated);
  }

  constructor(topRated) {
    super();
    this.#topRated = topRated;
  }
}
