import Component from '../component';
import ConfirmModal from '../Modal/Confirm';

import WarnModal from '../Modal/Warn';

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
    const isConfirmed = await ConfirmModal.confirm(
      'Você tem certeza de que deseja excluir este contato?'
    );

    const { contactId, options } = this.optionsCtx;
    if (!isConfirmed) return;

    try {
      const { state, emitter } = this.app;

      const [letterKey, index] = contactId.split('-');

      state.contacts.deleteContacts({ [letterKey]: [Number(index)] });

      const updateContactList = () =>
        emitter.emit('updateContactList', {
          removed: { [letterKey]: [Number(index)] },
        });

      options.turnSettingsOff(updateContactList);
    } catch (err) {
      WarnModal.warn('Não foi possível excluir este contato!');
    }
  }

  public render(): HTMLElement {
    this.$button.addEventListener('click', this.handleConfirmRemoveContact);
    return this.$button;
  }
}
