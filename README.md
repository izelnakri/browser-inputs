# Browser Inputs

Fast & mature native browser user input simulators for frontend testing. Includes 0 dependencies, extraced from ember.js

#### Installation:

```zsh
npm install browser-inputs
```

```ts
import { click } from 'browser-inputs';

await click(document.querySelector('#button'));
await click('#button');
```

- #### Public API:

- blur
- click
- doubleClick
- fillIn
- fireEvent
- focus
- scrollTo
- select
- tap
- triggerEvent
- triggerKeyEvent
- typeIn
