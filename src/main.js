import FilmsApiServices from './api-services/films-api-services';
import CommentsModel from './model/comments-model';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import CommentsApiServices from './api-services/comments-api-services';

const AUTORIZATION = 'Basic hjnf24ljbktcyfz1';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel(new FilmsApiServices(END_POINT, AUTORIZATION));
const filterModel = new FilterModel();
const commentsModel = new CommentsModel(new CommentsApiServices(END_POINT, AUTORIZATION));

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
boardPresenter.init();
filmsModel.init();
