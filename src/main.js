import BoardPresenter from './presenter/board_presenter';
import { render } from './render';
import FilmDetailsPopupView from './view/film-details-popup-view';
import RatingView from './view/rating-view';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const boardPresenter = new BoardPresenter();

render(new RatingView(), siteHeaderElement);
render(new FilmDetailsPopupView(), document.body);
boardPresenter.init(siteMainElement);
