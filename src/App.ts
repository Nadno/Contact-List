import Render from './views/Render';
import Router from './controllers/Router';
import Observer from './controllers/Emitter';

import ContactList from './models/ContactList';
import StringUtil from './utils/StringUtil';
import importPageComponent from './utils/importPageComponent';

import { IEmitter } from './controllers/Emitter/types';
import { IContactsList } from './models/ContactList/types';

export interface AppContext<S = any> {
  state: S;
  router: Router;
  emitter: IEmitter;
}

export interface AppState {
  contacts: IContactsList;
}

export default class App<S = any> {
  constructor(private ctx: AppContext<S>, private render: Render) {
    ctx.emitter.on('renderRoute', render.renderRoute);
  }

  public static createApp(): App {
    const $app = document.getElementById('app') || document.body;

    const emitter = new Observer();
    const contacts = new ContactList(new StringUtil());

    const router = new Router(location, emitter);
    $app.addEventListener('click', router.handleLinkClick);

    const context = {
      state: { contacts },
      emitter,
      router,
    };

    const render = Render.createRender($app, context);
    return new App<AppState>(context, render);
  }

  public start(): void {
    this.setRoutes();

    const { router } = this.ctx;
    router.renderPath();
    window.onpopstate = () => router.goTo(location.pathname);
  }

  private setRoutes(): void {
    const { router } = this.ctx;

    router.path('/', () => importPageComponent('Home'));
    router.path('/edit', () => importPageComponent('Contact/Edit'));
    router.path('/create', () => importPageComponent('Contact/Create'));
    router.path('/contact', () => importPageComponent('Contact/index'));
  }
}
