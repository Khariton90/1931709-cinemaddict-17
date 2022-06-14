import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class FilmsApiServices extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  };

  #adaptToServer = (film) => {
    const {comments, filmInfo, userDetails} = film;

    const adaptFilm = {...film,
      'comments': [...comments],
      'film_info': {...filmInfo,
        'age_rating': filmInfo.ageRating,
        'alternative_title': filmInfo.alternativeTitle,
        'total_rating': filmInfo.totalRating
      },
      'user_details': {...userDetails,
        'already_watched': userDetails.alreadyWatched,
        'watching_date': userDetails.watchingDate instanceof Date ? userDetails.watchingDate.toISOString() : null,
      }
    };

    delete adaptFilm.filmInfo;
    delete adaptFilm.userDetails;
    delete adaptFilm['film_info'].ageRating;
    delete adaptFilm['film_info'].alternativeTitle;
    delete adaptFilm['film_info'].alternativeTitle;
    delete adaptFilm['film_info'].totalRating;
    delete adaptFilm['user_details'].alreadyWatched;
    delete adaptFilm['user_details'].watchingDate;
    delete adaptFilm.mode;

    return adaptFilm;
  };
}

