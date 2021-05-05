export default abstract class Component<RenderReturn = HTMLElement> {
  public static createElement<K extends keyof HTMLElementTagNameMap>(
    name: K,
    content: string | Array<HTMLElement> = '',
    attrs?: Record<string, string>
  ): HTMLElementTagNameMap[K] {
    const $el: any = document.createElement(name);

    if (typeof content == 'string') {
      $el.insertAdjacentText('beforeend', content);
    } else {
      content.forEach($content =>
        $el.insertAdjacentElement('beforeend', $content)
      );
    }

    if (!attrs) return $el;
    const attrsAsArray = Object.entries(attrs);

    const setElementAttrs = ([key, value]: [string, string]) =>
      $el.setAttribute(key, value);
    attrsAsArray.forEach(setElementAttrs);

    return $el;
  }

  public abstract render(): RenderReturn;
}
