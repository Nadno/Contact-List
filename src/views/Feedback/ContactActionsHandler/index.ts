import Component from '../../component';
import NotifyList from '../Notifies';

import { IEmitter } from '../../../controllers/Emitter/types';
import { IContact } from '../../../models/ContactList/types';
import { IListNode } from '../../../models/LinkedList/types';
import { IContactListEmitter } from '../../../models/ContactListEmitter';

export default class ContactActionsHandler {
  constructor(
    private emitter: IEmitter,
    private notifies: NotifyList,
    private contacts: IContactListEmitter
  ) {}

  public handleCreate = (contact: IListNode<IContact>): void => {
    const $okBtn = Component.createElement('button', 'Ok', {
      className: 'button',
    });

    const $undoBtn = Component.createElement('button', 'Desfazer', {
      className: 'button --red',
    });

    const { name } = contact.value;

    const undoCreateContact = () => {
      if (!contact) return;

      const letterKey = this.contacts.getLetterKey(name);
      this.contacts.deleteContact(letterKey, contact, false);
      this.emitter.emit('updateContactList', { letterKey });
    };

    $undoBtn.addEventListener('click', undoCreateContact);

    this.notifies.addNotify({
      message: `O Contato <span class="notify__highlight">${
        name || 'Sem nome'
      }</span> foi criado com sucesso`,
      buttons: [$okBtn, $undoBtn],
      closeFn: this.notifies.clear,
    });
  };
}
