import { AppContext, AppState } from '../../../App';
import { IContact } from '../../../models/ContactList/types';
import Component from '../../component';

import PageComponent from '../PageComponent';

import '../../../styles/views/contact-page.scss';
export default abstract class ContactPage extends PageComponent {
  protected $element: HTMLElement = Component.createElement('div', '', {
    className: 'contact-page',
  });

  constructor(protected ctx: AppContext<AppState>) {
    super();
    this.$element.appendChild(this.backButton());
  }

  protected getContact(): IContact {
    const { state, router } = this.ctx;

    const { id } = router.getParams();
    const [key, index] = id.split('-');

    let result = { name: '', tel: '', createdAt: '' };
    if (!key || !index) return result;

    const contact = state.contacts.getContact(key, Number(index));
    if (!contact) return result;

    Object.assign(result, contact.value);
    return result;
  }

  protected backButton(): HTMLButtonElement {
    const $btn = Component.createElement(
      'button',
      `<i class="fas fa-arrow-left"></i>`,
      { className: 'button icon-btn' }
    );
    $btn.addEventListener('click', this.ctx.router.goBack);

    return $btn;
  }
}
