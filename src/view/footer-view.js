import AbstractView from '../framework/view/abstract-view';

const createFooterViewTemplate = (count) => (
  `<footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
      ${count ? `<p>${count} movies inside</p>` : ''}
    </section>
  </footer>`
);

export default class FooterView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createFooterViewTemplate(this.#count);
  }
}
