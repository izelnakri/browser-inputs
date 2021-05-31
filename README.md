# Browser Inputs

Fast & mature native browser user input simulators for frontend testing. Includes 0 dependencies, extracted from ember.js

#### Installation:

```zsh
npm install browser-inputs
```

```ts
import { click } from 'browser-inputs';

await click(document.querySelector('#button'));
await click('#button');
```

#### Public API:

- async blur(target, relatedTarget?)
- async click(target, mouseEventOptions?);
- async doubleClick(target, mouseEventOptions?);
- async fillIn(target, text);
- fireEvent(element, eventType, options?);
- async focus(target);
- async scrollTo(target, x, y);
- async select(target, optionsToSelect, keepPreviouslySelected = false);
- async tap(target, mouseEventOptions?);
- async triggerEvent(target, eventType, options?);
- async triggerKeyEvent(target, keyboardEventType, keyCode, keyModifier? = DEFAULT_MODIFIERS);
- async typeIn(target, text, optionsForDelay?);
