import Render from './views/Render';
import Router from './controllers/Router';
import Observer from './controllers/Emitter';

import Home from './views/routes/Home/Home';
import EditContact from './views/routes/Contact/Edit';
import CreateContact from './views/routes/Contact/Create';

import { IEmitter } from './controllers/Emitter/types';
import { IContactsList } from './models/ContactList/types';
import FactoryContactList from './models/ContactList/FactoryContactList';

export interface AppContext {
  router: Router;
  emitter: IEmitter;
}

export default class App {
  constructor(
    private emitter: IEmitter,
    private contacts: IContactsList,
    private router: Router,
    private render: Render
  ) {
    this.emitter.on('renderRoute', this.render.renderRoute);
  }

  public static createApp(): App {
    const $app = document.getElementById('app') || document.body;

    const emitter = new Observer();
    const contacts = FactoryContactList.createContactList(emitter);

    const router = new Router(location, emitter);
    $app.addEventListener('click', router.handleLinkClick);

    const render = Render.createRender($app, { router, emitter });
    return new App(emitter, contacts, router, render);
  }

  public start(): void {
    this.setRoutes();

    this.router.renderPath();
    window.onpopstate = () => this.router.goTo(location.pathname);
  }

  private setRoutes(): void {
    this.router.path('/', ctx => new Home(ctx).render());
    this.router.path('/edit', ctx => new EditContact(ctx).render());
    this.router.path('/create', ctx => new CreateContact(ctx).render());
  }
}
