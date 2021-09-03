# DevTools

Elf provides built-in integration with the Redux DevTools Chrome extension.

## Usage

Install the Redux extension from the supported App stores ( [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/) ).

And call the `devtools()` method:

```ts
import { devTools } from '@ngneat/elf';

devTools();
```

## Options

The plugin supports the following options passed as the second function parameter:

`maxAge`: Maximum amount of actions to be stored in the history tree.

`preAction`: A method that's called before each action.
