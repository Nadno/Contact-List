import emitter from './controllers/Observer';
import ContactList from './models/ContactList';
import Router from './controllers/Router';

import Home from './views/routes/Home/Home';
import EditContact from './views/routes/Edit';
import CreateContact from './views/routes/Create';

import StringUtil from './utils/StringUtil';

import {
  ContactAndPosition,
  IContact,
  IContactsList,
} from './models/ContactList/types';
import { IObserver } from './controllers/Observer/types';
import Render from './views/Render';
import NotFound from './views/routes/404';

export interface AppContext {
  router: Router;
  emitter: IObserver;
}

export default class App {
  constructor(
    private emitter: IObserver,
    private contacts: IContactsList,
    private router: Router,
    private render: Render
  ) {
    this.emitter.on('renderRoute', this.render.renderRoute);
  }

  public static createApp(): App {
    const $app = document.getElementById('app') || document.body;
    const contacts = new ContactList(new StringUtil());

    const router = new Router(location, emitter);
    $app.addEventListener('click', router.handleLinkClick);

    const render = Render.createRender($app, { router, emitter });
    return new App(emitter, contacts, router, render);
  }

  public start(): void {
    this.setRoutes();
    this.subscribeEvents();
    this.router.renderPath();

    window.onpopstate = () => this.router.goTo(location.pathname);
  }

  private setRoutes(): void {
    this.router.path('/', Home);
    this.router.path('/create', CreateContact);
  }

  private subscribeEvents() {
    const createContact = (contact: IContact) => {
      contact.createdAt = new Date().toLocaleDateString('pt-BR');
      this.contacts.createContact(contact);
    };

    this.emitter.on('create-contact', createContact);
  }
}
