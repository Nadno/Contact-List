import ContactList from '.';
import StringUtil from '../../utils/StringUtil';

import { ContactAndPosition, IContact, IContactsList } from './types';
import { IEmitter } from '../../controllers/Emitter/types';

export default class FactoryContactList {
  public static createContactList(emitter: IEmitter) {
    const contacts = new ContactList(new StringUtil());
    return new FactoryContactList().subscribeEvents(contacts, emitter);
  }

  public subscribeEvents(
    contacts: IContactsList,
    emitter: IEmitter
  ): IContactsList {
    emitter.on('forEachContactList', contacts.forEachList.bind(contacts));

    const createContact = (contact: IContact) => {
      contact.createdAt = new Date().toLocaleDateString('pt-BR');
      contacts.createContact(contact);
    };
    emitter.on('createContact', createContact);

    const editContact = ({ contact, letterKey, index }: ContactAndPosition) =>
      contacts.editContact(contact, { letterKey, index });
    emitter.on('editContact', editContact);

    const findContact = ({ handleResult, query }: any) =>
      handleResult(contacts.findAll(query));
    emitter.on('findContact', findContact);

    const getContact = ({ key, index, handleContact }: any) =>
      handleContact(contacts.getContact(key, index));
    emitter.on('getContact', getContact);

    return contacts;
  }
}
