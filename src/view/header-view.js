import AbstractView from '../framework/view/abstract-view';

const createHeaderViewTemplate = () => (
  `<header class="header">
    <h1 class="header__logo logo">Cinemaddict</h1></header>`
);

export default class HeaderView extends AbstractView {
  get template() {
    return createHeaderViewTemplate();
  }
}
