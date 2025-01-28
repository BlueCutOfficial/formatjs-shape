# formatjs-shape README

This is a Visual Studio Code extension to help introducing [Format.JS](https://formatjs.github.io/) into an existing codebase. Select a string or template string then format it automatically to follow formatjs spec.

## In js and ts files

### Usage 

1. Select a string in your code file, including quotes!
2. Open the command palette (cmd + shif + P)
3. Run the command "Refactor the selected message to formatjs"

Your string is formatted to follow [Format.JS specification](https://formatjs.github.io/docs/getting-started/message-declaration/#using-imperative-api-intlformatmessage).

```js
// before
`Hello ${username}`

// after
intl.formatMessage({ defaultMessage: 'Hello {username}' }, { username })
```

### Features

This extension supports:
- Literal strings (between single or double quotes)
- Template strings with or without any code expressions
- Multiline template strings

### Limitations

- The built options don't necessarily have a perfect name. Complex code in a template string turns to "optionN".
- If you use the same code twice in a template string, the same option will be generated twice.
- The current version doesn't handle backquotes well.

## In Handlebars templates

Additionnally to the strict Format.js API, this extension also comes with a solution for Handlebars templates.
It supposes that you would implement a `formatMessage` helper that internally relies on Format.js, so you can 
also extract and format bare strings in templates.

### Usage

1. Select the exact piece of string you want to be formatted
2. Open the command palette (cmd + shif + P)
3. Run the command "Refactor the selected HTML with a formatjs-like Handlebars helper"

```hbs
// before
Hello {{username}}

// after
{{formatMessage "Hello {username}" username=username}}
```

### Features

This extension supports:
- Presence of double quotes in the formatted string
- Insertion of triple curlies to allow HTML in the formatted string
- Multiline strings

### Limitations

- The built options don't necessarily have a perfect name. Complex code in a template string turns to "optionN".
- If you use the same code twice in a handlebars variable, the same option will be generated twice.
- Calls to Handlebars helpers in the formatted piece are not supported.

## Extension Settings

N/A

## Release Notes

* 0.2.0 - Add a command to refactor Handlebars templates.
* 0.1.0 - Supports template strings without code expressions and multiline template strings.
* 0.0.1 - Initial version.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
* [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)
