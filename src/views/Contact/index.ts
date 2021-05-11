import Link from '../../controllers/Link';
import Component from '../component';
import ContactOptions from '../ContactOptions/index';

export default class Contact extends Component<HTMLLIElement> {
  $contact: HTMLLIElement;

  constructor(name: string, id: string) {
    super();

    const $name = Link({
      content: name,
      href: `/contact?id=${id}`,
      className: 'contact__name',
    });

    const $edit = ContactOptions.OptionsButton();

    this.$contact = Component.createElement('li', [$name, $edit], {
      className: 'contact',
      'data-id': id,
    });
  }

  public render(): HTMLLIElement {
    return this.$contact;
  }
}
