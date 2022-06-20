import ApiService from '../framework/api-service';
import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #comments = [];
  #commentsApiService = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (update) => {
    try {
      const comments = await this.#commentsApiService.getComments(update.id);
      this.#comments = comments.map((comment) => comment);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(update);
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#commentsApiService.addComment(update);
      const parsedResponse = await ApiService.parseResponse(response);

      this.#comments = [...parsedResponse.comments];
      this._notify(updateType, update);
    } catch(err) {
      return this.#comments;
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.comments);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update.comments);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
