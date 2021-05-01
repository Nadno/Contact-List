export interface IContact {
  name: string;
  number: string;
  createdAt: string;
}

export interface ContactPositions {
  [contactFirstLetter: string]: number[];
}

export interface IContactsList {
  [Symbol.iterator](): void;

  sort(): void;
  reverse(): void;
  editContact(
    data: Partial<IContact>,
    position: { key: string; index: number }
  ): boolean;
  createContact(contact: IContact): void;
  deleteContacts(contactsPositions: ContactPositions): IContact[] | undefined;
}
