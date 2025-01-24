# formatjs-shape README

This is a Visual Studio Code extension to help introducing [Format.JS](https://formatjs.github.io/) into an existing codebase. Select a string or template string then format it automatically to follow formatjs spec.

## Features

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

## Extension Settings

N/A

## Limitations

- The built options don't necessarily have a perfect name. Complex code in a template string turns to "optionN".
- If you use the same code twice in a template string, the same option will be generated twice, so you need to update your object.
- The current version doesn't handle backquotes well.

## Release Notes

N/A

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
* [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)
