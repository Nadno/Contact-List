import Form from './Form';

import '../../../public/styles/views/contact-form.scss';

interface ContactFormData {
  name: string;
  tel: string;
  [key: string]: string;
}

interface IContactForm {
  submit: string;
  formTitle: string;
  initialData?: ContactFormData;
  handleSubmit: (e: Event) => any;
}

export default class ContactForm {
  public formElement: HTMLElement;
  public data: ContactFormData;

  constructor({
    submit,
    formTitle,
    handleSubmit,
    initialData = { name: '', tel: '' },
  }: IContactForm) {
    this.handleChange = this.handleChange.bind(this);

    const { data, formElement } = new Form(initialData)
      .setCurrentHandleChange(this.handleChange)
      .createField(formTitle, [
        {
          id: 'name',
          name: 'name',
          label: 'Nome',
          placeholder: 'Nome',
        },
        {
          id: 'tel',
          name: 'tel',
          label: 'Número de telefone',
          placeholder: 'ex.: 912345678',
        },
      ])
      .createForm({ class: 'contact-form' }, submit, handleSubmit);

    this.data = data;
    this.formElement = formElement;
  }

  private handleChange(e: Event): void {
    const { name, value } = e.target as HTMLInputElement;
    const { data } = this;

    if (name in data) data[name] = value;
  }
}
