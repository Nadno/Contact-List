import Component from '../component';
import ConfirmModal from '../Feedback/Modal/Confirm';

import WarnModal from '../Feedback/Modal/Warn';

import { AppContext, AppState } from '../../App';
import { ContactOptionsContext } from '.';

export default class RemoveContact extends Component {
  private $button: HTMLElement;

  constructor(
    attrs: Record<string, string>,
    private optionsCtx: ContactOptionsContext,
    private app: AppContext<AppState>
  ) {
    super();

    this.handleConfirmRemoveContact =
      this.handleConfirmRemoveContact.bind(this);

    this.$button = Component.createElement('button', 'Excluir', attrs);
  }

  private async handleConfirmRemoveContact(): Promise<void> {
    const isConfirmed = await ConfirmModal.confirm({
      title: 'Excluir contato',
      message: 'Você tem certeza de que deseja excluir este contato?',
    });

    const { contact, options } = this.optionsCtx;
    if (!isConfirmed) {
      options.focus();
      options.turnSettingsOff();
      return;
    }

    try {
      const { state, emitter } = this.app;
      const { letter: letterKey, index } = options.query.splitId(contact.id);
      const [contactNode] = state.contacts.deleteContacts({
        [letterKey]: [index],
      });

      if (!contactNode) throw '';

      emitter.emit('updateContactList', {
        removed: { [letterKey]: [index] },
      });
      emitter.emit('updateResultList', contact.id);
    } catch {
      WarnModal.warn({
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir este contato!',
      });
    }
  }

  public render(): HTMLElement {
    this.$button.addEventListener('click', this.handleConfirmRemoveContact);
    return this.$button;
  }
}
