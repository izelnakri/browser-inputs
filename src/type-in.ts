import Target, {
  FormControl,
  isFormControl,
  guardForMaxlength,
  isContentEditable,
  isDocument,
  HTMLElementContentEditable,
} from './internal/index';
import getElement from './internal/get-element';
import { __focus__ } from './focus';
import { __triggerKeyEvent__ } from './trigger-key-event';
import fireEvent from './fire-event';

export interface Options {
  delay?: number;
}

/**
 * Mimics character by character entry into the target `input` or `textarea` element.
 *
 * Allows for simulation of slow entry by passing an optional millisecond delay
 * between key events.

 * The major difference between `typeIn` and `fillIn` is that `typeIn` triggers
 * keyboard events as well as `input` and `change`.
 * Typically this looks like `focus` -> `focusin` -> `keydown` -> `keypress` -> `keyup` -> `input` -> `change`
 * per character of the passed text (this may vary on some browsers).
 */
export default async function typeIn(
  target: Target,
  text: string,
  options: Options = {}
): Promise<Event | void> {
  if (!target) {
    throw new Error('Must pass an element or selector to `typeIn`.');
  }

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`typeIn('${target}')\``);
  } else if (isDocument(element) || (!isFormControl(element) && !isContentEditable(element))) {
    throw new Error('`typeIn` is only usable on form controls or contenteditable elements.');
  } else if (typeof text === 'undefined' || text === null) {
    throw new Error('Must provide `text` when calling `typeIn`.');
  } else if (isFormControl(element)) {
    if (element.disabled) {
      throw new Error(`Can not \`typeIn\` disabled '${target}'.`);
    } else if ('readOnly' in element && element.readOnly) {
      throw new Error(`Can not \`typeIn\` readonly '${target}'.`);
    }
  }

  __focus__(element);

  let { delay = 50 } = options;

  return fillOut(element, text, delay).then(() => fireEvent(element, 'change'));
  // .then(settled)
}

function fillOut(element: FormControl | HTMLElementContentEditable, text: string, delay: number) {
  let inputFunctions = text.split('').map((character) => keyEntry(element, character));
  return inputFunctions.reduce((currentPromise, func) => {
    return currentPromise.then(() => delayedExecute(delay)).then(func);
  }, Promise.resolve(undefined));
}

function keyEntry(
  element: FormControl | HTMLElementContentEditable,
  character: string
): () => void {
  let shiftKey = character === character.toUpperCase() && character !== character.toLowerCase();
  let options = { shiftKey };
  let characterKey = character.toUpperCase();

  return function () {
    // NOTE: this was returning promise previously in @ember/test-helpers
    __triggerKeyEvent__(element, 'keydown', characterKey, options);
    __triggerKeyEvent__(element, 'keypress', characterKey, options);

    if (isFormControl(element)) {
      let newValue = element.value + character;
      guardForMaxlength(element, newValue, 'typeIn');

      element.value = newValue;
    } else {
      element.innerHTML = element.innerHTML + character;
    }

    fireEvent(element, 'input');

    __triggerKeyEvent__(element, 'keyup', characterKey, options);
  };
}

function delayedExecute(delay: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
