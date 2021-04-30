import Link from '../../controllers/Link';
import Component from '../component';
import Settings from './Settings';

export default class Contact extends Component {
  $contact: HTMLElement;

  constructor(name: string, id: string) {
    super();

    const $name = Link({
      content: name,
      href: `/contact?id=${id}`,
      className: 'contact__name',
    });

    const $edit = Settings.SettingButton();

    this.$contact = Component.createElement('li', [$name, $edit], {
      class: 'contact',
      'data-id': id,
    });
  }

  public render(): HTMLElement {
    return this.$contact;
  }
}
