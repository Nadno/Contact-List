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
  getLetterKey(name: string): string;
  getList(letterKey: string): ILinkedList<IContact> | undefined;
  getContact(letterKey: string, index: number): IListNode<IContact> | undefined;
  findAll(name: string): ILinkedList<ContactAndPosition>;
  editContact(
    data: Partial<IContact>,
    position: ContactPosition
  ): IListNode<IContact> | undefined;
  createContact(contact: IContact): IListNode<IContact> | undefined;
  deleteContact(
    key: string,
    contact: IListNode<IContact>
  ): IListNode<IContact> | undefined;
  deleteContacts(contactsPositions: ContactPositions): IListNode<IContact>[];
}

export interface ContactAndPosition extends ContactPosition {
  contact: IContact;
}
