import { render } from './framework/render';
import { generateFilter } from './mock/filter';
import FilmsModel from './model/film-model';
import BoardPresenter from './presenter/board-presenter';
import FilterView from './view/filter-view';
import RatingView from './view/rating-view';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel();
const filter = generateFilter(filmsModel.films);


render(new FilterView(filter), siteMainElement);
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel);

render(new RatingView(), siteHeaderElement);

boardPresenter.init();
