import { AppContext, AppState } from '../../../App';
import { IContact } from '../../../models/ContactList/types';

import PageComponent from '../PageComponent';

export default abstract class ContactPage extends PageComponent {
  constructor(protected ctx: AppContext<AppState>) {
    super();
  }

  protected getContact(): IContact {
    const { state, router } = this.ctx;

    const { id } = router.getParams();
    const [key, index] = id.split('-');

    let result = { name: '', tel: '', createdAt: '' };
    if (!key || !index) return result;

    const contact = state.contacts.getContact(key, Number(index));
    if (!contact) return result;

    Object.assign(result, contact.value);
    return result;
  }
}
