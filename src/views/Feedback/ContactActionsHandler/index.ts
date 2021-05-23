import Component from '../../component';
import NotifyList from '../Notifies';

import { IEmitter } from '../../../controllers/Emitter/types';
import { IContact } from '../../../models/ContactList/types';
import { IListNode } from '../../../models/LinkedList/types';
import { IContactListEmitter } from '../../../models/ContactListEmitter';

export default class ContactActionsHandler {
  constructor(
    private emitter: IEmitter,
    private notifyList: NotifyList,
    private contacts: IContactListEmitter
  ) {}

  protected createDefaultButtons(): HTMLButtonElement[] {
    const $okBtn = Component.createElement('button', 'Ok', {
      className: 'button',
    });

    const $undoBtn = Component.createElement('button', 'Desfazer', {
      className: 'button --red',
    });

    return [$okBtn, $undoBtn];
  }

  protected createHandler(
    message: (contact: IListNode<IContact>) => string,
    undoFn: (this: this, contact: IListNode<IContact>) => any
  ): (contact: IListNode<IContact>) => any {
    return (contact: IListNode<IContact>) => {
      const buttons = this.createDefaultButtons();

      const [, $undoBtn] = buttons;
      $undoBtn.addEventListener('click', undoFn.bind(this, contact));

      const { notifyList } = this;
      notifyList.addNotify({
        message: message(contact),
        buttons,
        closeFn: notifyList.clear,
      });
    };
  }

  protected undoCreateContact(contact: IListNode<IContact>) {
    if (!contact) return;

    const { name } = contact.value;
    const { contacts, emitter } = this;
    const letterKey = contacts.getLetterKey(name);

    contacts.deleteContact(letterKey, contact, false);
    emitter.emit('updateContactList', { letterKey });
  }

  public handleCreateContact = this.createHandler(
    ({ value }) =>
      `O Contato <span class="notify__highlight">${
        value.name || 'Sem nome'
      }</span> foi criado com sucesso`,
    this.undoCreateContact
  );

  protected undoDeleteContact(contact: IListNode<IContact>) {
    if (!contact) return;

    const { name } = contact.value;
    const { contacts, emitter } = this;
    contacts.createContact(contact.value, false);

    const letterKey = contacts.getLetterKey(name);
    emitter.emit('updateContactList', { letterKey });
    emitter.emit('updateResultList');
  }

  public handleDeleteContact = this.createHandler(
    ({ value }) =>
      `Contato <span class="notify__highlight">${
        value.name || 'Sem nome'
      }</span> excluído.`,
    this.undoDeleteContact
  );
}
