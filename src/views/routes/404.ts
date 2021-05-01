import PageComponent from './PageComponent';

import '../../../public/styles/views/not-found.scss';

export default class NotFound extends PageComponent {
  constructor() {
    super();
    this.setTitle('404');
  }

  public render(): HTMLElement {
    const $title = PageComponent.createElement('h2', 'Página não encontrada!');
    const $content = PageComponent.createElement(
      'p',
      'Por favor, retorne a página inicial para encontrar o que procura.'
    );

    return PageComponent.createElement('div', [$title, $content], {
      class: 'not-found',
    });
  }
}
