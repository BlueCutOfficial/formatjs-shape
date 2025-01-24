import * as assert from 'assert';
import { refactorMessage } from '../extension';

suite('Formatjs Shape Test Suite', () => {
	test('it formats a simple string', () => {
		const refactor = refactorMessage(`'Formatjs Shape Tests'`);
		assert.strictEqual(
			refactor,
			`intl.formatMessage({ defaultMessage: 'Formatjs Shape Tests' })`
		);
	});

	test('it formats a string with double quotes', () => {
		const refactor = refactorMessage(`"Let's test some template strings!"`);
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

	test('it formats a template string containing several quasis', () => {
		const refactor = refactorMessage(`\`Here are my favorite songs: \${this.getSongs().filter((song) => song.isFavirite())}. Hey \${username}, these are not my favorite, but do you like them? \${this.getSongs().filter((song) => !song.isFavirite())}\``);
		assert.strictEqual(
			refactor,
			`intl.formatMessage({ defaultMessage: 'Here are my favorite songs: {option1}. Hey {username}, these are not my favorite, but do you like them? {option2}' }, { option1: this.getSongs().filter((song) => song.isFavirite()), username, option2: this.getSongs().filter((song) => !song.isFavirite()) })`
		);
	});
});