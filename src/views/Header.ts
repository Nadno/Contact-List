import Link from '../controllers/Link';
import Component from './component';

export default class Header extends Component {
  private $header: HTMLElement;
  constructor() {
    super();

    const $search = this.createSearchBar();

    const $addContact = Link({
      title: 'Criar contato',
      href: '/create',
      content: '+',
      class: 'header__add-contact',
    });

    this.$header = Component.createElement('header', [$search, $addContact], {
      class: 'header',
    });
  }

  private createSearchBar(): HTMLElement {
    const $search = Component.createElement('input', '', {
      id: 'search',
      name: 'search',
      type: 'search',
      class: 'search',
      placeholder: 'Encontrar contato',
    });

    const $submit = Component.createElement('button', 'buscar', {
      class: 'search__button',
      type: 'submit',
    });

    return Component.createElement('form', [$search, $submit], {
      class: 'search-bar',
    });
  }

  public render(): HTMLElement {
    return this.$header;
  }
}
