import Contacts from '../../models/ContactList';
import StringUtil from '../../utils/StringUtil';

describe('Contacts functionalities', () => {
	const contacts = new Contacts(new StringUtil());
	const listEx = [
		'Noah',
		'Gael',
		'Miguel',
		'Benjamim',
		'Ravi',
		'Gabriel',
		'Gustavo',
		'Guilherme',
		'Guevin',
		'Lucas',
	];

	describe('Create contact', () => {
		it('should insert contacts names in crescent order', () => {
			listEx.forEach((name) =>
				contacts.createContact({
					name,
					createdAt: '',
					number: '',
				})
			);

			const checkCrescentOrder = (node) => {
				if (node.next) {
					expect(node.value <= node.next.value).toBe(true);
				}
			};

			contacts.lists['g'].forEach(checkCrescentOrder, { includeNodes: true });
		});

		it('should create a especial characters list to especial/empty names', () => {
			contacts.createContact({
				name: '',
				createdAt: '2013-02',
				number: '2354325325',
			});

			expect.anything(contacts.lists[Contacts.especialKey]);
		});
	});

	describe('ForEachList', () => {
		it('should iterate for each contact list', () => {
			contacts.forEachList((_, letterKey) =>
				expect.anything(contacts.getList(letterKey))
			);
		});
	});

	describe('Find all contacts', () => {
		it(`
        should return a linked list with all matches for the passed query 
        and the firsts contacts must start with the initial letter of the passed query
      `, () => {
			const contactNodes = contacts.findAll('Gu');

			expect.anything(contactNodes.start);

			const checkContactPosition = (contactInfo) => {
				const contactList = contacts.getList(contactInfo.contact.name);
				const expected = contactList.at(contactInfo.index).value;
				expect(contactInfo.contact).toBe(expected);
			};

			contactNodes.forEach(checkContactPosition);
		});
	});

	describe('Edit contact', () => {
		it('should edit the contact in the key and index passed', () => {
			const expected = {
				name: 'Miguel Araujo',
				createdAt: '2020-12',
				number: '2354325325',
			};

			contacts.editContact(expected, { letterKey: 'm', index: 0 });

			const [contact] = contacts.getList('m');
			expect(contact.value).toEqual(expected);
		});

		it('should edit and move the contact when changed the letter key of contact name', () => {
			const expected = {
				name: 'Ana',
				createdAt: '2020-12',
				number: '2354325325',
			};

			contacts.editContact(expected, { letterKey: 'm', index: 0 });

			const result = contacts.getList('m');
			expect(result).toBeUndefined();

			const [ana] = contacts.getList('a');
			expect(ana.value).toEqual(expected);
		});
	});

	describe('Delete contact', () => {
		it('should delete the contacts in the keys and indexes passed', () => {
			contacts.deleteContacts({
				a: [0],
				g: [0, 1, 2],
			});

			expect(contacts.lists['a']).toBeUndefined();
			expect(contacts.lists['g'].at(2)).toBeUndefined();
		});
	});
});
