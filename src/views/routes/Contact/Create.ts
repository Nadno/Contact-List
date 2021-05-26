import ContactPage from './ContactPage';
import ContactForm from '../../utils/ContactForm';

import { AppContext, AppState } from '../../../App';
import { IContact } from '../../../models/ContactList/types';

export default class CreateContact extends ContactPage {
  private formData: Omit<IContact, 'createdAt'>;

  constructor(ctx: AppContext<AppState>) {
    super(ctx);

    this.setTitle('Criar contato');

    const { formElement, data } = new ContactForm({
      submit: 'Criar',
      formTitle: 'Criar contato',
      handleSubmit: this.handleSubmit.bind(this),
    });

    this.formData = data;
    this.$element.appendChild(formElement);
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    const { state } = this.ctx;

    const createdAt = new Date().toLocaleDateString('pt-BR');
    const contact = Object.assign({ createdAt }, this.formData);
    state.contacts.createContact(contact);
  }

  public render(): HTMLElement[] {
    return [this.$element];
  }
}
