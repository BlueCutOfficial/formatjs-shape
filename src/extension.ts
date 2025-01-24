import * as vscode from 'vscode';

const camelCase = require('lodash.camelcase');

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('formatjs-shape.refactor', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor &&  editor.selection) {
			const document = editor.document;
			const selection = editor.selection;

			const selectedText = document.getText(selection); // include quotes
			const replacement = refactorMessage(selectedText.trim());

			editor.edit(editBuilder => {
				editBuilder.replace(selection, replacement);
			});
		}
	});

	context.subscriptions.push(disposable);
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

			// Build an "ok" option name for the expression
			let optionName = camelCase(expression.replace('this.', ''));
			if (optionName.length > 20) {
				optionName = `option${i}`;
				i++;
			}

			options.push(optionName === expression 
				? `${optionName}` 
				: `${optionName}: ${expression}`
			);
			replacement = replacement.replace(`\${${expression}`, `{${optionName}`);
		}
		replacement = `${replacement}, { ${options.join(', ')} }`.replaceAll('`', quote(trimedSelectedText));
	} else if (selectedText[0] === '`') { // A template string without any code expression
		replacement = `${replacement}`.replaceAll('`', quote(trimedSelectedText));
	}

	return (`intl.formatMessage(${replacement})`).replaceAll(/\s+/g, ' ');
}

// Returns ', or " if the argument contains a simple quote.
// Works only if you pass the "trimed" string without the quotes encapsulating it.
function quote(trimedSelectedText: string): string {
	return trimedSelectedText.includes("'") ? '"' : "'";
}

export function deactivate() {}
