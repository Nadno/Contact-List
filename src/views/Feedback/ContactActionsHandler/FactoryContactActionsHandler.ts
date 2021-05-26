import ContactListEmitter from '../../../models/ContactListEmitter';
import StringUtil from '../../../utils/StringUtil';
import NotifyList from '../Notifies';
import ContactActionsHandler from '.';

import { IContact, IContactsList } from '../../../models/ContactList/types';
import { IEmitter } from '../../../controllers/Emitter/types';

export default class FactoryContactActionsHandler {
  public static createContactList(
    emitter: IEmitter,
    notifyList: NotifyList,
    contacts?: IContact[]
  ): IContactsList {
    const contactList = new ContactListEmitter(
      emitter,
      new StringUtil(),
      contacts
    );
    const contactActionsHandler = new ContactActionsHandler(
      emitter,
      notifyList,
      contactList
    );

    emitter.on('contactCreated', contactActionsHandler.handleCreateContact);
    emitter.on('contactDeleted', contactActionsHandler.handleDeleteContact);
    emitter.on('contactEdited', contactActionsHandler.handleEditContact);

    return contactList;
  }
}
