import Component from '../views/component';

interface LinkAttrs extends Record<string, string | undefined> {
  title?: string;
  href: string;
  className?: string;
  content?: string;
}

const Link = ({ title = '', href, content = '', ...rest }: LinkAttrs) => {
  const attrs: any = {
    'data-link': '',
    href,
    ...rest,
  };

  if (title) attrs.title = title;

  return Component.createElement('a', content, attrs);
};

export default Link;
