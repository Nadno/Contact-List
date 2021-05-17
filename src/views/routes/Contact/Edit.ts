import ContactPage from './ContactPage';
import ContactForm from '../../utils/ContactForm';
import WarnModal from '../../Modal/Warn';

import { AppContext, AppState } from '../../../App';

export default class EditContact extends ContactPage {
  private $element: HTMLElement;
  private formData: Record<string, string>;

  constructor(ctx: AppContext<AppState>) {
    super(ctx);

    this.setTitle('Editar contato');

    const { name, tel } = this.getContact();

    const { formElement, data } = new ContactForm({
      submit: 'Salvar',
      formTitle: 'Editar contato',
      initialData: { name, tel },
      handleSubmit: this.handleSubmit.bind(this),
    });

    this.formData = data;
    this.$element = formElement;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    const { state, router } = this.ctx;
    const { id } = router.getParams();

    if (id) {
      const contact = Object.assign({}, this.formData);
      const [letterKey, index] = id.split('-');

      state.contacts.editContact(contact, {
        letterKey,
        index: Number(index),
      });

      WarnModal.warn('As alterações foram salvas com sucesso!', router.goBack);
    }
  }

  public render(): HTMLElement[] {
    return [this.$element];
  }
}
