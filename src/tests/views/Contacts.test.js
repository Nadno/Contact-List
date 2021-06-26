import Contacts from '../../views/Contact/Contacts';

describe('Contacts component', () => {
	const contacts = new Contacts({
		class: 'contacts',
		type: 'A',
	});

	let $list;

	it('should have a render method', () => {
		expect.anything(contacts.render());
	});

	it('should create a list of contacts ', () => {
		const ex = ['nome1', 'nome2', 'nome2'];

		ex.forEach((name, index) =>
			contacts.addContact({ contact: { name }, letterKey: name[0], index })
		);

		$list = contacts.render();
		expect($list.querySelectorAll('li').length).toBe(3);
	});

	it('should append a setting element when clicked the options button', () => {
		const $contactSettingOne = $list.querySelector('.options-container');

		expect($contactSettingOne.querySelector('.options')).toBeNull();

		$contactSettingOne.querySelector('.options-button').click();
		expect.anything($contactSettingOne.querySelector('.options'));
	});

	it('should move the options element when already on', () => {
		const [$contactSettingOne, $contactSettingTwo] =
			$list.querySelectorAll('.options-container');
		$contactSettingTwo.querySelector('.options-button').click();

		$contactSettingTwo.addEventListener('transitionend', () => {
			expect.anything($contactSettingTwo.querySelector('.options'));
			expect($contactSettingOne.querySelector('.options')).toBeNull();
		});
	});

	it('should remove the options element when clicked at second time', () => {
		const [, $contactSettingTwo] = $list.querySelectorAll('.options-container');

		$contactSettingTwo.addEventListener('transitionend', () =>
			expect($contactSettingTwo.querySelector('.options')).toBeNull()
		);
		$contactSettingTwo.querySelector('.options-button').click();
	});
});
