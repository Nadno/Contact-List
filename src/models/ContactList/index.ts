import LinkedList from '../LinkedList';
import { IListNode } from '../LinkedList/types';
import { ContactPositions, IContact, IContactsList } from './types';

const ALPHABET_KEYS = 'abcdefghijklmnopqrsuvwxyz';

export default class ContactList implements IContactsList {
  public static especialKey = '#';

  contactProperty;
  sortMethod: 'crescent' | 'decrescent';
  sortConfig = {
    crescent: (c1: IContact, c2: IContact) =>
      c1[this.contactProperty as keyof IContact] <
      c2[this.contactProperty as keyof IContact],
    decrescent: (c1: IContact, c2: IContact) =>
      c1[this.contactProperty as keyof IContact] >
      c2[this.contactProperty as keyof IContact],
  };

  lists: Record<string, LinkedList<IContact>> = {};
  favorites: LinkedList<IContact> = new LinkedList();

  constructor(contactProperty = 'name', sortMethod = 'crescent') {
    this.contactProperty = contactProperty;
    this.sortMethod = sortMethod as 'crescent';
  }

  private normalize(content: string): string {
    return content
      .normalize('NFD')
      .replace(/[^a-zA-Z]/g, '')
      .toLowerCase();
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
    { key, index }: { key: string; index: number }
  ): boolean {
    try {
      const contact = this.lists[key].at(index);

      if (!contact) throw new Error('Contact not find');
      Object.assign(contact.value, data);

      return true;
    } catch (err) {
      console.error(err);
      return false;
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

  public deleteContacts(contactsMap: ContactPositions): IContact[] | undefined {
    const deletedContacts: IContact[] = [];

    for (const key in contactsMap) {
      const list = this.lists[key];
      const contactsNodes = list.nodesAt(...contactsMap[key]);

      const deleteContactNode = (node: IListNode<IContact>) => {
        let deletedNode;

        if (node === list.start) {
          deletedNode = list.shift();
        } else if (node === list.end) {
          deletedNode = list.pop();
        } else {
          deletedNode = node.remove();
        }

        if (deletedNode) deletedContacts.push(deletedNode.value);
      };

      contactsNodes.forEach(deleteContactNode);
    }

    return deletedContacts.length ? deletedContacts : undefined;
  }
}
