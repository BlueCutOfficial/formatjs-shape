import * as vscode from 'vscode';

const camelCase = require('lodash.camelcase');

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('formatjs-shape.refactor', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor &&  editor.selection) {
			const document = editor.document;
			const selection = editor.selection;

			const selectedText = document.getText(selection); // include quotes
			const trimedSelectedText = selectedText.slice(1, selectedText.length-1); // exclude quotes

			let replacement = `{ defaultMessage: ${selectedText} }`;

			// Handle template strings
			const quasis = selectedText.match(/\$\{[^\}]*\}/mg);
			if (quasis?.length) {
				let i = 1;
				const options = [];
				for (const quasi of quasis) {
					const expression = quasi.slice(2, quasi.length-1);

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
				const quote = trimedSelectedText.includes("'") ? '"' : "'";
				replacement = `${replacement}, { ${options.join(', ')} }`.replaceAll('`', quote);
			}

			replacement = `intl.formatMessage(${replacement})`;

			editor.edit(editBuilder => {
				editBuilder.replace(selection, replacement);
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
