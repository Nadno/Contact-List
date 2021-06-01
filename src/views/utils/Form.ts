import LinkedList from '../../models/LinkedList';
import Component from '../component';

type EventHandler = (e: Event) => any;

export interface CreateInput {
  id: string;
  name: string;
  label?: string;
  handleChange?: EventHandler;
  [rest: string]: string | EventHandler | undefined;
}

export default class Form<IniData extends Record<string, any>> {
  private $formElement: HTMLFormElement | undefined;

  private fieldset: LinkedList<HTMLElement> = new LinkedList();
  private handleChange: EventHandler | undefined;

  constructor(private data: IniData) {}

  public setCurrentHandleChange(handleChange: EventHandler): this {
    this.handleChange = handleChange;
    return this;
  }

  public createInput({
    id,
    name,
    label,
    handleChange = this.handleChange,
    ...rest
  }: CreateInput): this {
    const $label = Component.createElement('label', label, {
      className: 'input-block__label',
      for: id,
    });

    const $input = Component.createElement('input', '', {
      id,
      name,
      className: 'input-block__input',
      ...rest,
    });
    $input.value = this.data[name as keyof IniData];

    if (handleChange) $input.addEventListener('input', handleChange);

    const $inputBlock = Component.createElement('div', [$label, $input], {
      className: 'input-block',
    });

    if (!this.fieldset.end)
      throw new Error('You cannot create a input without a fieldset');

    this.fieldset.end.value.appendChild($inputBlock);

    return this;
  }

  public createField(legend: string, inputs: Array<CreateInput>): this {
    const $legend = Component.createElement('legend', legend);

    this.fieldset.push(Component.createElement('fieldset', [$legend]));
    inputs.forEach(input => this.createInput(input));

    return this;
  }

  public createForm(
    formAttrs: {},
    submit: string,
    handleSubmit: EventHandler
  ): { formElement: HTMLFormElement; data: IniData } {
    const $submit = Component.createElement('button', submit, {
      type: 'submit',
      className: 'button default-btn',
    });

    const $fields = this.fieldset.toArray();
    this.$formElement = Component.createElement(
      'form',
      [...$fields, $submit],
      formAttrs
    );

    this.$formElement.addEventListener('submit', handleSubmit);

    return { formElement: this.$formElement, data: this.data };
  }
}
