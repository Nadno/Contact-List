export default abstract class Component<RenderReturn = HTMLElement> {
  public static createElement<K extends keyof HTMLElementTagNameMap>(
    name: K,
    content: string | Array<HTMLElement> = '',
    attrs?: Record<string, string>
  ): HTMLElementTagNameMap[K] {
    const $el: any = document.createElement(name);

    if (typeof content == 'string') {
      $el.insertAdjacentHTML('beforeend', content);
    } else {
      content.forEach($content =>
        $el.insertAdjacentElement('beforeend', $content)
      );
    }

    
    if (!attrs) return $el;
    const { className, ...rest } = attrs;

    if (className) $el.className = className;
    
    if (!rest) return $el;
    const attrsAsArray = Object.entries(rest);

    const setElementAttrs = ([key, value]: [string, string]) =>
      $el.setAttribute(key, value);
    attrsAsArray.forEach(setElementAttrs);

    return $el;
  }

  public abstract render(): RenderReturn;
}
