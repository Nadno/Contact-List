import Link from '../../controllers/Link';
import Component from '../component';

interface SettingsItem {
  href: string;
  label: string;
}

export default class Setting extends Component {
  settingsItems: SettingsItem[];

  constructor(items: SettingsItem[]) {
    super();
    this.settingsItems = items;
    this.createItem = this.createItem.bind(this);
  }

  public static SettingButton(): HTMLElement {
    const $dots = [null, null, null].map(() =>
      Component.createElement('span', '', { class: 'dot' })
    );

    const $btn = Component.createElement('button', $dots, {
      class: 'settings-button',
      'role': 'switch',
      'aria-label': 'exibir opções de contato'
    });

    const $settingContainer = Component.createElement('div', [$btn], {
      class: 'settings-container',
    });

    return $settingContainer;
  }

  private createItem({ href, label }: SettingsItem): HTMLElement {
    const $item = Link({ href, content: label });
    return Component.createElement('li', [$item]);
  }

  render() {
    const $settingItems = this.settingsItems.map(this.createItem);

    const $settings = Component.createElement('ul', $settingItems, {
      class: 'settings-list',
    });

    const $bg = Component.createElement('div', [$settings], {
      class: 'settings',
    });

    return $bg;
  }
}
