import Modal from '.';
import Component from '../../component';

interface IModalTemplate {
  setTitle(title: string): this;
  setMessage(message: string): this;
}

export default function ModalTemplate<M extends Modal>(
  modal: M
): M & IModalTemplate {
  const $title = Component.createElement('h2', '', {
    className: 'modal__title',
  });

  const $content = Component.createElement('p', '', {
    className: 'modal__content',
  });

  const $hr = Component.createElement('hr');

  const $buttons = Component.createElement('div', '', {
    className: 'modal__buttons',
  });

  modal
    .addElement($title, 'title')
    .addElement($content, 'content')
    .addElement($hr)
    .addElement($buttons, 'buttons');

  type ModalThis = M & IModalTemplate;
  
  return Object.assign<M, IModalTemplate>(modal, {
    setTitle(this: ModalThis, title: string): ModalThis {
      this.getElementByType('title').textContent = title;
      return this;
    },

    setMessage(this: ModalThis, message: string): ModalThis {
      this.getElementByType('content').textContent = message;
      return this;
    },
  });
}
