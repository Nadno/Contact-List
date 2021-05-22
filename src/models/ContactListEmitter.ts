import StringUtil from '../utils/StringUtil';
import ContactList from './ContactList';

import { IListNode } from './LinkedList/types';
import {
  ContactPosition,
  ContactPositions,
  IContact,
  IContactsList,
} from './ContactList/types';
import { IEmitter } from '../controllers/Emitter/types';

export interface IContactListEmitter extends IContactsList {
  editContact(
    data: Partial<IContact>,
    pos: ContactPosition,
    emit?: boolean
  ): IListNode<IContact> | undefined;
  createContact(
    contact: IContact,
    emit?: boolean
  ): IListNode<IContact> | undefined;

  deleteContact(
    letterKey: string,
    contact: IListNode<IContact>,
    emit?: boolean
  ): IListNode<IContact> | undefined;
}

export default class ContactListEmitter
  extends ContactList
  implements IContactListEmitter
{
  constructor(private emitter: IEmitter, stringUtil: StringUtil) {
    super(stringUtil);
  }

  public editContact(
    data: Partial<IContact>,
    pos: ContactPosition,
    emit: boolean = true
  ): IListNode<IContact> | undefined {
    const result = super.editContact(data, pos);
    emit && this.emitter.emit('contactEdited', result);
    return result;
  }

  public createContact(
    contact: IContact,
    emit: boolean = true
  ): IListNode<IContact> | undefined {
    const result = super.createContact(contact);
    emit && this.emitter.emit('contactCreated', result);
    return result;
  }

  public deleteContact(
    letterKey: string,
    contact: IListNode<IContact>,
    emit: boolean = true
  ): IListNode<IContact> | undefined {
    const result = super.deleteContact(letterKey, contact);
    emit && this.emitter.emit('contactDeleted', result);
    return result;
  }

  public deleteContacts(
    contactsMap: ContactPositions,
    emit: boolean = true
  ): IListNode<IContact>[] {
    const result = super.deleteContacts(contactsMap);
    emit && this.emitter.emit('contactDeleted', result);
    return result;
  }
}
