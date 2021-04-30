import emitter, { Observer } from './controllers/Observer';
import ContactList from './models/ContactList';
import Router from './controllers/Router';

import CreateContact from './views/routes/Create';
import Home from './views/routes/Home/Home';

import { IContact } from './models/ContactList/types';

export interface AppContext {
  emitter: Observer;
  contacts: ContactList;
}

export default class App {
  constructor(
    private emitter: Observer,
    private contacts: ContactList,
    private router: Router
  ) {}

  public static createApp(): App {
    const $app = document.getElementById('app') || document.body;
    const contacts = new ContactList();

    const router = new Router($app, { contacts, emitter });
    return new App(emitter, contacts, router);
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
