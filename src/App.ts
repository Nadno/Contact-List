import Render from './views/Render';
import Router from './controllers/Router';
import Emitter from './controllers/Emitter';

import NotifyList from './views/Feedback/Notifies';
import importPageComponent from './utils/importPageComponent';
import FactoryContactActionsHandler from './views/Feedback/ContactActionsHandler/FactoryContactActionsHandler';

import { IEmitter } from './controllers/Emitter/types';
import { IContactsList } from './models/ContactList/types';
import Fallback from './views/Fallback';

export interface AppContext<S = any> {
  state: S;
  router: Router;
  emitter: IEmitter;
}

export interface AppState {
  contacts: IContactsList;
  notifyList: NotifyList;
}

export default class App<S = any> {
  constructor(private ctx: AppContext<S>, private render: Render) {
    ctx.emitter.on('renderRoute', render.renderRoute);
  }

  public static createApp($app: HTMLElement | null): App {
    if (!$app) throw new Error("We can't create the app, missing app element");

    const emitter = new Emitter();
    const notifyList = new NotifyList('notifies');
    const contacts = FactoryContactActionsHandler.createContactList(
      emitter,
      notifyList
    );

    const router = new Router(location, emitter);

    const context = {
      state: { contacts, notifyList },
      emitter,
      router,
    };

    const routeFallback = () => Fallback.getFallbackView();
    const render = new Render(routeFallback, $app, context);
    return new App<AppState>(context, render);
  }

  public start(): void {
    this.setRoutes();

    const { router } = this.ctx;

    document.body.addEventListener('click', router.handleLinkClick);

    router.renderPath();
    window.onpopstate = (e: PopStateEvent) => {
      e.preventDefault();
      router.goTo(location.href);
    };
  }

  private setRoutes(): void {
    const { router } = this.ctx;

    router.path('/', () => importPageComponent('Home'));
    router.path('/edit', () => importPageComponent('Contact/Edit'));
    router.path('/create', () => importPageComponent('Contact/Create'));
    router.path('/contact', () => importPageComponent('Contact/index'));
  }
}
