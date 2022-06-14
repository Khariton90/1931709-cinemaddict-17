import { FilterTypes, UserTitle } from '../consts';
import AbstractView from '../framework/view/abstract-view';

const createRatingTemplate = (filter) => {
  const historyFilter = filter.find((element) => element.name === FilterTypes.HISTORY);
  const { count } = historyFilter;
  const  { NOVICE, FAN, MOVIE_BUFF } = UserTitle;

  const profiles = {
    novice: count >= NOVICE[0] && count <= NOVICE[1],
    fan: count >= FAN[0] && count <= FAN[1],
    movieBuff:  count >= MOVIE_BUFF[0] && count <= MOVIE_BUFF[1]
  };

  if (count) {
    return(
      `<section class="header__profile profile">
        ${ profiles.novice  ? '<p class="profile__rating">Novice</p>': '' }
        ${ profiles.fan ? '<p class="profile__rating">Fan</p>': '' }
        ${ profiles.movieBuff ? '<p class="profile__rating">Movie Buff</p>': '' }
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
    );
  }

  return '<section class="header__profile profile"></section>';
};


export default class RatingView extends AbstractView {
  #filter = null;
  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createRatingTemplate(this.#filter);
  }
}
