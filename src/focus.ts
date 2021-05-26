import fireEvent from './fire-event';
import { __blur__ } from './blur';
import Target, { isFocusable } from './internal/index';
import getElement from './internal/get-element';

export function __focus__(element: HTMLElement | Element | Document | SVGElement): void {
  if (!isFocusable(element)) {
    throw new Error(`${element} is not focusable`);
  }

  let browserIsNotFocused = document.hasFocus && !document.hasFocus();

  if (
    document.activeElement &&
    document.activeElement !== element &&
    isFocusable(document.activeElement)
  ) {
    __blur__(document.activeElement);
  }

  // makes `document.activeElement` be `element`. If the browser is focused, it also fires a focus event
  element.focus();

  // Firefox does not trigger the `focusin` event if the window
  // does not have focus. If the document does not have focus then
  // fire `focusin` event as well.
  if (browserIsNotFocused) {
    // if the browser is not focused the previous `el.focus()` didn't fire an event, so we simulate it
    fireEvent(element, 'focus', {
      bubbles: false,
    });

    fireEvent(element, 'focusin');
  }
}

export default async function focus(target: Target): Promise<void> {
  if (!target) {
    throw new Error('Must pass an element or selector to `focus`.');
  }

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`focus('${target}')\`.`);
  }

  __focus__(element);

  // return settled();
}
