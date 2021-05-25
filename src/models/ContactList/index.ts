import StringUtil from '../../utils/StringUtil';
import LinkedList from '../LinkedList';

import { ILinkedList, IListNode } from '../LinkedList/types';
import {
  ContactAndPosition,
  ContactPositions,
  ContactPosition,
  IContact,
  IContactsList,
} from './types';

const SORT_FUNCTION = (a: IContact, b: IContact) => a.name < b.name;

export default class ContactList implements IContactsList {
  public static readonly ALPHABET_KEYS = 'abcdefghijklmnopqrstuvwxyz';
  public static readonly especialKey = '#';

  private lists: Record<string, LinkedList<IContact>> = {};

  constructor(private stringUtil: StringUtil) {}

  public forEachList(
    cb: (contacts: ILinkedList<IContact>, letterKey: string) => any,
    startByLetterKey: string = ''
  ) {
    const startKey = this.stringUtil.normalize(startByLetterKey);
    const alphabetKeys = ContactList.ALPHABET_KEYS.replace(startKey, '');

    const keys = startKey + alphabetKeys + ContactList.especialKey;

    for (const letterKey of keys) {
      if (letterKey in this.lists) cb(this.lists[letterKey], letterKey);
    }
  }

  private addList(letterKey: string): void {
    if (letterKey.length !== 1)
      throw new Error('The key string exceeded the allowed length');
    this.lists[letterKey] = new LinkedList<IContact>();
  }

  public getList(letterKey: string): ILinkedList<IContact> | undefined {
    const normalizedKey =
      this.stringUtil.normalize(letterKey) || ContactList.especialKey;

    if (normalizedKey.length !== 1) return undefined;
    return this.lists[letterKey];
  }

  public getLetterKey(name: string): string {
    const letterKey = this.stringUtil.normalize(name)[0];

    if (!letterKey) return ContactList.especialKey;
    if (ContactList.ALPHABET_KEYS.includes(letterKey)) return letterKey;

    return ContactList.especialKey;
  }

  public getContact(
    key: string = '',
    index: number
  ): IListNode<IContact> | undefined {
    const list = this.getList(key);
    if (!list) return list;

    return list.at(index);
  }

  public findAll(name: string): ILinkedList<ContactAndPosition> {
    const result = new LinkedList<ContactAndPosition>();
    const { likeMatch, normalize } = this.stringUtil;

    const normalizedName = normalize(name);
    const startByLetterKey = normalizedName[0];

    const search = (contacts: ILinkedList<IContact>, letterKey: string) => {
      const searchInList = (contact: IContact, index: number) => {
        if (likeMatch(normalize(contact.name), normalizedName)) {
          result.push({ contact, letterKey, index });
        }
      };
      contacts.forEach(searchInList);
    };

    this.forEachList(search, startByLetterKey);

    return result;
  }

  public editContact(
    data: Partial<IContact>,
    { letterKey, index }: ContactPosition
  ): IListNode<IContact> | undefined {
    const list = this.lists[letterKey];

    const contact = list.at(index);
    if (!contact) throw new Error('Contact not found');

    const isNewName = data.name && data.name !== contact.value.name;
    if (isNewName) {
      const deletedContact = this.deleteContact(letterKey, contact);
      if (!deletedContact) return;

      const newContact = Object.assign({}, { ...contact.value, ...data });
      this.createContact(newContact);

      return deletedContact;
    }

    Object.assign(contact.value, data);
    return contact;
  }

  public createContact(contact: IContact): IListNode<IContact> | undefined {
    const letterKey = this.getLetterKey(contact.name);
    if (!this.lists[letterKey]) this.addList(letterKey);

    if (letterKey === ContactList.especialKey)
      return this.lists[letterKey].insert('end', contact);

    return this.lists[letterKey].insertSort(contact, SORT_FUNCTION);
  }

  public deleteContact(
    letterKey: string,
    contact: IListNode<IContact>
  ): IListNode<IContact> | undefined {
    const deletedContact = this.lists[letterKey].remove(contact);
    if (!this.lists[letterKey].length) delete this.lists[letterKey];

    return deletedContact;
  }

  public deleteContacts(contactsMap: ContactPositions): IListNode<IContact>[] {
    const deletedContacts: IListNode<IContact>[] = [];

    for (const key in contactsMap) {
      const list = this.lists[key];
      const contactsNodes = list.nodesAt(...contactsMap[key]);

      const deleteContactNode = (node: IListNode<IContact>) => {
        let deletedNode = this.deleteContact(key, node);
        if (deletedNode) deletedContacts.push(deletedNode);
      };

      contactsNodes.forEach(deleteContactNode);
    }

    return deletedContacts;
  }
}
