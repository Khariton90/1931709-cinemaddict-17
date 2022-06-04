import { render } from './framework/render';
import FilmsModel from './model/film-model';
import FilterModel from './model/filter-model';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import RatingView from './view/rating-view';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);


render(new RatingView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
