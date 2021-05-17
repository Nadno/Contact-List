import { AppContext } from '../../../App';
import Component from '../../component';
import ContactPage from './ContactPage';

import '../../../../public/styles/views/contact.scss';

export default class Contact extends ContactPage {
  private elements: HTMLElement[] = [];

  constructor(ctx: AppContext) {
    super(ctx);

    const { name, tel } = this.getContact();
    this.setTitle(name);

    const $div = Component.createElement('div', '', {
      className: 'contact-detail'
    });
    const { ddd, number } = this.splitTel(tel);

    $div.insertAdjacentHTML(
      'beforeend',
      `<div class="info-block">
          <span class="contact-detail__label">Nome:</span>
          <span class="contact-detail__name">${name}</span>
        </div>
        <div class="info-block">
          <span class="contact-detail__label">Telefone:</span>
          <div class="contact-detail__number">
            <span>${ddd}</span>
            <span>${number}</span>
          </div>
        </div>
      `
    );

    this.elements.push($div);
  }

  public splitTel(tel: string) {
    const ddd = `(${tel.slice(0, 2)})`;
    return { ddd, number: tel.slice(2) };
  }

  public render(): HTMLElement[] {
    return this.elements;
  }
}
