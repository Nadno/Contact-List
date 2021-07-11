import PageComponent from './routes/PageComponent';
import '../styles/views/fallback.scss';

class NotFound extends PageComponent {
  constructor() {
    super();
    this.setTitle('404');
  }

  public render(): HTMLElement[] {
    const $title = PageComponent.createElement('h2', 'Página não encontrada!');
    const $content = PageComponent.createElement(
      'p',
      'Por favor, retorne a página inicial para encontrar o que procura.'
    );

    return [
      PageComponent.createElement('div', [$title, $content], {
        className: 'fallback',
      }),
    ];
  }
}

class ConnectionLost extends PageComponent {
  constructor() {
    super();
    this.setTitle('Conexão perdida');
  }

  public render(): HTMLElement[] {
    const $title = PageComponent.createElement('h2', 'Sem conexão!');
    const $content = PageComponent.createElement(
      'p',
      'Por favor, verifique sua conexão com a internet e tente novamente.'
    );

    return [
      PageComponent.createElement('div', [$title, $content], {
        className: 'fallback',
      }),
    ];
  }
}

export default class Fallback {
  private static fallbackInstance: Fallback = new Fallback();

  public static getFallbackView() {
    return new Fallback.fallbackInstance.fallbacks[
      Fallback.fallbackInstance.selectedFallback
    ]();
  }

  public static setFallbackView(fallback: string) {
    Fallback.fallbackInstance.setFallback(fallback);
  }

  private fallbacks = {
    NotFound,
    ConnectionLost,
  };

  private _selectedFallback = 'NotFound';

  public get selectedFallback() {
    return this._selectedFallback as 'NotFound' | 'ConnectionLost';
  }

  public setFallback(fallback: string) {
    this._selectedFallback = fallback;
  }
}
