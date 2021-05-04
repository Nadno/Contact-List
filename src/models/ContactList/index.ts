import LinkedList from '../LinkedList';
import { ILinkedList, IListNode } from '../LinkedList/types';
import {
  ContactAndPosition,
  ContactPosition,
  ContactPositions,
  IContact,
  IContactsList,
} from './types';

const ALPHABET_KEYS = 'abcdefghijklmnopqrsuvwxyz';

export default class ContactList implements IContactsList {
  public static especialKey = '#';

  private contactProperty;
  private sortMethod: 'crescent' | 'decrescent';
  private sortConfig = {
    crescent: (c1: IContact, c2: IContact) =>
      c1[this.contactProperty as keyof IContact] <
      c2[this.contactProperty as keyof IContact],
    decrescent: (c1: IContact, c2: IContact) =>
      c1[this.contactProperty as keyof IContact] >
      c2[this.contactProperty as keyof IContact],
  };

  private lists: Record<string, LinkedList<IContact>> = {};
  private favorites: LinkedList<IContact> = new LinkedList();

  constructor(contactProperty = 'name', sortMethod = 'crescent') {
    this.contactProperty = contactProperty;
    this.sortMethod = sortMethod as 'crescent';
  }

  public forEach(
    cb: (contact: IContact, letterKey: string, index: number) => any,
    startByLetterKey: string = ''
  ) {
    const alphabetKeys = ALPHABET_KEYS.replace(
      this.normalize(startByLetterKey),
      ''
    );

    const keys = startByLetterKey + alphabetKeys + ContactList.especialKey;

    for (const letterKey of keys) {
      let index = 0;

      if (letterKey in this.lists) {
        for (const contact of this.lists[letterKey]) {
          cb(contact, letterKey, index);
          index++;
        }
      }
    }
  }

  private normalize(content: string): string {
    return content
      .normalize('NFD')
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();
  }

  private matchStrings(name: string, query: string): boolean {
    const normalizedName = this.normalize(name);
    const normalizedQuery = this.normalize(query);

    return !!normalizedName.match(`${normalizedQuery}.*`);
  }

  private addList(key: string): void {
    if (key.length !== 1)
      throw new Error('The key string exceeded the allowed length');
    this.lists[key] = new LinkedList<IContact>();
  }

  private addSymbolList(): void {
    this.lists[ContactList.especialKey] = new LinkedList<IContact>();
  }

  public sort(): void {}

  public reverse(): void {}

  public editContact(
    data: Partial<IContact>,
    { letterKey, index }: ContactPosition
  ): boolean {
    let result = false;

    try {
      const list = this.lists[letterKey];
      const contact = list.at(index);

      if (!contact) throw new Error('Contact not find');
      const newContact = Object.assign(contact.value, data);

      const deletedContact = list.remove(contact);
      if (!deletedContact) return result;

      this.createContact(newContact);
      result = true;
    } catch (err) {
      console.error(err);
    } finally {
      return result;
    }
  }

  public createContact(contact: IContact): void {
    const [key] = this.normalize(contact.name);
    contact.name = contact.name || 'Sem nome';

    const isAlphabeticLetter = ALPHABET_KEYS.includes(key);
    if (isAlphabeticLetter && !(key in this.lists)) this.addList(key);

    if (!isAlphabeticLetter) {
      const hasEspecialKey = ContactList.especialKey in this.lists;
      if (!hasEspecialKey) this.addSymbolList();

      this.lists[ContactList.especialKey].push(contact);
      return;
    }

    this.lists[key].insertSort(contact, this.sortConfig[this.sortMethod]);
  }

  public deleteContacts(contactsMap: ContactPositions): ILinkedList<IContact> {
    const deletedContacts = new LinkedList<IContact>();

    for (const key in contactsMap) {
      const list = this.lists[key];
      const contactsNodes = list.nodesAt(...contactsMap[key]);

      const deleteContactNode = (node: IListNode<IContact>) => {
        let deletedNode = list.remove(node);
        if (deletedNode) deletedContacts.push(deletedNode.value);
      };

      contactsNodes.forEach(deleteContactNode);
      if (!list.length) delete this.lists[key];
    }

    return deletedContacts;
  }
}
