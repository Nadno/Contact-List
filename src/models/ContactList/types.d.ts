import { ILinkedList, IListNode } from '../LinkedList/types';

export interface IContact {
  name: string;
  tel: string;
  createdAt: string;
}

export interface ContactPositions {
  [contactFirstLetter: string]: number[];
}

export interface ContactPosition {
  letterKey: string;
  index: number;
}

export interface IContactsList {
  forEachList(
    cb: (contacts: ILinkedList<IContact>, letterKey: string) => any
  ): void;
  getContact(key: string, index: number): IListNode<IContact> | undefined;
  findAll(name: string): ILinkedList<ContactAndPosition>;
  editContact(data: Partial<IContact>, position: ContactPosition): boolean;
  createContact(contact: IContact): void;
  deleteContacts(contactsPositions: ContactPositions): ILinkedList<IContact>;
}

export interface ContactAndPosition extends ContactPosition {
  contact: IContact;
}
