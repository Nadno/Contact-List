import ContactPage from './ContactPage';
import ContactForm from '../../utils/ContactForm';

import { AppContext, AppState } from '../../../App';

import '../../../../public/styles/views/create-contact.scss';
import { IContact } from '../../../models/ContactList/types';
import WarnModal from '../../Modal/Warn';

export default class CreateContact extends ContactPage {
  private $element: HTMLElement;
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
    this.$element = formElement;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    const { state, router } = this.ctx;

    const createdAt = new Date().toLocaleDateString('pt-BR');
    const contact = Object.assign({ createdAt }, this.formData);
    state.contacts.createContact(contact);

    WarnModal.warn('Contato criado com sucesso!', router.goBack);
  }

  public render(): HTMLElement[] {
    return [this.$element];
  }
}
