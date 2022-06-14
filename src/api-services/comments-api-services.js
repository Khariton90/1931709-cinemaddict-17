import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class CommentsApiServices extends ApiService {
  getComments = async (id) => await this._load({url: `comments/${id}`})
    .then(ApiService.parseResponse);

  deleteComment = async (id) => {
    const response = await this._load({
      url: `comments/${id}`,
      method: Method.DELETE
    });
    return response;
  };

  addComment = async (film) => {
    const response = this._load({
      url:`comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(film.comment),
      headers: new Headers({'Content-type': 'application/json'})
    });

    return response;
  };
}

