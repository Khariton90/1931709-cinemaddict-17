import { UpdateType } from '../consts';
import Observable from '../framework/observable';

export default class FilmsModel extends Observable {
  constructor(filmsApiService) {
    super();

    this.#filmsApiService = filmsApiService;
  }

  #filmsApiService = null;
  #films = [];

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1)];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptFilm = {...film,
      filmInfo: {
        ...film.film_info,
        ageRating: film.film_info.age_rating,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating
      },
      userDetails: {
        ...film.user_details,
        alreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date
      },
    };

    delete adaptFilm.film_info;
    delete adaptFilm.user_details;
    delete adaptFilm.filmInfo.age_rating;
    delete adaptFilm.filmInfo.alternative_title;
    delete adaptFilm.filmInfo.total_rating;
    delete adaptFilm.userDetails.already_watched;
    delete adaptFilm.userDetails.watching_date;

    return adaptFilm;
  };
}
