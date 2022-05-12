import FilmsModel from './model/film-model';
import BoardPresenter from './presenter/board-presenter';
import { render } from './render';
import RatingView from './view/rating-view';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel();
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel);

render(new RatingView(), siteHeaderElement);

boardPresenter.init();
