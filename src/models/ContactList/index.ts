import StringUtil from '../../utils/StringUtil';
import LinkedList from '../LinkedList';
import { ILinkedList, IListNode } from '../LinkedList/types';
import {
  ContactAndPosition,
  ContactPosition,
  ContactPositions,
  IContact,
  IContactsList,
} from './types';

const ALPHABET_KEYS = 'abcdefghijklmnopqtrsuvwxyz';

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

  constructor(
    private stringUtil: StringUtil,
    contactProperty = 'name',
    sortMethod = 'crescent'
  ) {
    this.contactProperty = contactProperty;
    this.sortMethod = sortMethod as 'crescent';
  }

  public forEachList(
    cb: (contacts: ILinkedList<IContact>, letterKey: string) => any,
    startByLetterKey: string = ''
  ) {
    const startKey = this.stringUtil.normalize(startByLetterKey);
    const alphabetKeys = ALPHABET_KEYS.replace(startKey, '');

    const keys = startKey + alphabetKeys + ContactList.especialKey;

    for (const letterKey of keys) {
      if (letterKey in this.lists) cb(this.lists[letterKey], letterKey);
    }
  }

  private addList(key: string): void {
    if (key.length !== 1)
      throw new Error('The key string exceeded the allowed length');
    this.lists[key] = new LinkedList<IContact>();
  }

  private addSymbolList(): void {
    this.lists[ContactList.especialKey] = new LinkedList<IContact>();
  }

  public getList(
    key: string = ContactList.especialKey
  ): ILinkedList<IContact> | undefined {
    const normalizedKey = this.stringUtil.normalize(key);
    if (normalizedKey.length !== 1) return undefined;
    return this.lists[key];
  }

  public sort(): void {}

  public reverse(): void {}

  public findAll(name: string): ILinkedList<ContactAndPosition> {
    const result = new LinkedList<ContactAndPosition>();
    const { likeMatch, normalize } = this.stringUtil;

    const normalizedName = normalize(name);
    const [startByLetterKey] = normalizedName;

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
    const [key] = this.stringUtil.normalize(contact.name);

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
