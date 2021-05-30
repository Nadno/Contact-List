interface ContactId {
  letter: string;
  index: number;
}

export interface ISelectContactList {
  splitId(id: string): ContactId;
  selectContact(id: string, child?: string): HTMLElement;
  selectSubList(id: string, isContactId?: boolean): HTMLElement | null;
}

export default class SelectContactList implements ISelectContactList {
  constructor(public $self: HTMLOListElement) {}

  public splitId(id: string): ContactId {
    const [letter, index] = id.split('-');
    if (!letter || !index)
      throw new Error('Error trying get a contact without a letter or index');

    return { letter, index: Number(index) };
  }

  public selectContact(id: string, child?: string): HTMLElement {
    const { letter } = this.splitId(id);

    const $list = this.selectSubList(letter) || this.$self;

    const query = `[data-id="${id}"]`;
    const $contact = $list.querySelector<HTMLElement>(query);

    if (!$contact) throw new Error('Element "Contact" not found');
    if (child) {
      const $child = $contact.querySelector<HTMLElement>(child);
      if (!$child) throw new Error('Child element in "Contact" not found');
      return $child;
    }
    return $contact;
  }

  public selectSubList(
    id: string,
    isContactId: boolean = false
  ): HTMLElement | null {
    if (isContactId) {
      const { letter } = this.splitId(id);
      id = letter;
    }

    return this.$self.querySelector(`#letter-${id}`);
  }
}
