import * as vscode from 'vscode';

const camelCase = require('lodash.camelcase');

export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand('formatjs-shape.refactor', () => {	
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.selection) {
				const selection = editor.selection;
				const selectedText = editor.document.getText(selection);
				const replacement = refactorMessage(selectedText.trim());
				editor.edit(editBuilder => {
					editBuilder.replace(selection, replacement);
				});
			}
		}),
		vscode.commands.registerCommand('formatjs-shape.refactorTemplate', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.selection) {
				const selection = editor.selection;
				const selectedText = editor.document.getText(selection);
				const replacement = refactorTemplateMessage(selectedText);
				editor.edit(editBuilder => {
					editBuilder.replace(selection, replacement);
				});
			}
		}) 
	];

	context.subscriptions.push(...disposables);
}

export function refactorMessage(selectedText: string): string {
	const trimedSelectedText = selectedText.slice(1, selectedText.length-1); // exclude quotes

	let replacement = `{ defaultMessage: ${selectedText} }`;

	// Handle template strings
	const strExpressions = selectedText.match(/\$\{[^\}]*\}/mg);
	if (strExpressions?.length) {
		let i = 1;
		const options = [];
		for (const strExpr of strExpressions) {
			const expression = strExpr.slice(2, strExpr.length-1);

			let option = buildOption(expression, i);
			i = option.index;

			options.push(option.name === expression 
				? `${option.name}` 
				: `${option.name}: ${expression}`
			);
			replacement = replacement.replace(`\${${expression}`, `{${option.name}`);
		}
		replacement = `${replacement}, { ${options.join(', ')} }`.replaceAll('`', quote(trimedSelectedText));
	} else if (selectedText[0] === '`') { // A template string without any code expression
		replacement = `${replacement}`.replaceAll('`', quote(trimedSelectedText));
	}

	return (`intl.formatMessage(${replacement})`).replaceAll(/\s+/g, ' ');
}

export function refactorTemplateMessage(selectedText: string): string {
	let replacement = `"${selectedText.replaceAll('"', '\\"').replaceAll(/\s+/g, ' ').trim()}"`;

	const strExpressions = (selectedText.match(/{{[^}]*}}/mg));
	const options = [];
	if (strExpressions?.length) {
		let i = 1;
		for (const strExpr of strExpressions) {
			const expression = strExpr.slice(2, strExpr.length-2);

			let option = buildOption(expression, i);
			i = option.index;
			options.push(`${option.name}=${expression}`);

			replacement = replacement.replace(`{{${expression}}}`, `{${option.name}}`);
		}
		replacement = `${replacement} ${options.join(' ')}`;
	}

	// If the selection contains HTML, use Handlebars triple curlies
	const curlies = (selectedText.match(/<[^>]*>/mg))?.length 
		? { o: '{{{', c: '}}}' } 
		: { o: '{{', c: '}}' };

	return (`${curlies.o}formatMessage ${replacement}${curlies.c}`);
}

export function deactivate() {}

// Returns ', or " if the argument contains a simple quote.
// Works only if you pass the "trimed" string without the quotes encapsulating it.
function quote(trimedSelectedText: string): string {
	return trimedSelectedText.includes("'") ? '"' : "'";
}

// Build an "ok" option name for the expression
function buildOption(expression: string, index: number): { name: string, index: number } {
	let name = camelCase(expression.replace('this.', ''));
	if (name.length > 20) {
		name = `option${index}`;
		index++;
	}
	return { name, index };
}
