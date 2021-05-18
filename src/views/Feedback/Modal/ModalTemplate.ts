import Modal from '.';
import Component from '../../component';

export default class ModalTemplate {
  public static defaultTemplate<M extends Modal>(modal: M): M {
    const $content = Component.createElement('p', '', {
      className: 'modal__content',
    });

    const $hr = Component.createElement('hr');

    const $buttons = Component.createElement('div', '', {
      className: 'modal__buttons',
    });

    modal
      .addElement($content, 'content')
      .addElement($hr)
      .addElement($buttons, 'buttons');

    return modal;
  }
}
