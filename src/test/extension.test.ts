import * as assert from 'assert';
import { refactorMessage, refactorTemplateMessage } from '../extension';

suite('Formatjs Shape Test Suite', () => {
	suite('"refactor" command', () => {
		test('it formats a simple literal string', () => {
			const refactor = refactorMessage(`'Formatjs Shape Tests'`);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'Formatjs Shape Tests' })`
			);
		});
	
		test('it formats a literal string with double quotes', () => {
			const refactor = refactorMessage(`"Let's test some template strings!"`);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: "Let's test some template strings!" })`
			);
		});
	
		test('it formats a template string without any code', () => {
			const refactor = refactorMessage(`\`Hello\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'Hello' })`
			);
		});
	
		test('it formats a template string without any code containing a simple quote', () => {
			const refactor = refactorMessage(`\`Let's test some template strings!\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: "Let's test some template strings!" })`
			);
		});
	
		test('it formats a template string containing an identifier', () => {
			const refactor = refactorMessage(`\`Hello \${username}\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'Hello {username}' }, { username })`
			);
		});
	
		test('it formats a template string containing a simple quote', () => {
			const refactor = refactorMessage(`\`Hello \${username}, let's listen to some songs!\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: "Hello {username}, let's listen to some songs!" }, { username })`
			);
		});
	
		test('it formats a template string containing a call expression', () => {
			const refactor = refactorMessage(`\`List of songs: \${this.getSongs()}\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'List of songs: {getSongs}' }, { getSongs: this.getSongs() })`
			);
		});
	
		test('it formats a template string containing a long piece of code', () => {
			const refactor = refactorMessage(`\`My favorite songs: \${this.getSongs().filter((song) => song.isFavirite())}\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'My favorite songs: {option1}' }, { option1: this.getSongs().filter((song) => song.isFavirite()) })`
			);
		});
	
		test('it formats a template string containing several code expressions', () => {
			const refactor = refactorMessage(`\`Here are my favorite songs: \${this.getSongs().filter((song) => song.isFavirite())}. Hey \${username}, these are not my favorite, but do you like them? \${this.getSongs().filter((song) => !song.isFavirite())}\``);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'Here are my favorite songs: {option1}. Hey {username}, these are not my favorite, but do you like them? {option2}' }, { option1: this.getSongs().filter((song) => song.isFavirite()), username, option2: this.getSongs().filter((song) => !song.isFavirite()) })`
			);
		});
	
		test('it formats a multiline string', () => {
			const refactor = refactorMessage(`
				\`Hello \${username},
					how are you?\`
			`);
			assert.strictEqual(
				refactor,
				`intl.formatMessage({ defaultMessage: 'Hello {username}, how are you?' }, { username })`
			);
		});
	});

	suite('"refactorTemplate" command', () => {
		test('it formats a simple bare string', () => {
			const refactor = refactorTemplateMessage(`Formatjs Shape Tests`);
			assert.strictEqual(
				refactor,
				`{{formatMessage "Formatjs Shape Tests"}}`
			);
		});

		test('it formats a bare string containing double quotes', () => {
			const refactor = refactorTemplateMessage(`Formatjs "Shape" Tests`);
			assert.strictEqual(
				refactor,
				`{{formatMessage "Formatjs \\"Shape\\" Tests"}}`
			);
		});

		test('it formats a bare string containing a variable', () => {
			const refactor = refactorTemplateMessage(`Hello {{username}}`);
			assert.strictEqual(
				refactor,
				`{{formatMessage "Hello {username}" username=username}}`
			);
		});

		test('it formats a bare string containing some HTML', () => {
			const refactor = refactorTemplateMessage(`Let's listen to some <b>songs</b>!`);
			assert.strictEqual(
				refactor,
				`{{{formatMessage "Let's listen to some <b>songs</b>!"}}}`
			);
		});

		test('it formats a bare string containing double quotes, variables and HTML', () => {
			const refactor = refactorTemplateMessage(`Click <a href="{{this.link}}">here</a> to see the list of songs`);
			assert.strictEqual(
				refactor,
				`{{{formatMessage "Click <a href=\\"{link}\\">here</a> to see the list of songs" link=this.link}}}`
			);
		});

		test('it formats a multiline bare string', () => {
			const refactor = refactorTemplateMessage(`
				Hello {{username}},
				how are you?
			`);
			assert.strictEqual(
				refactor,
				`{{formatMessage "Hello {username}, how are you?" username=username}}`
			);
		});
	});
});