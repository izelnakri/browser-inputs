import fireEvent from './fire-event';
import { __blur__ } from './blur';
import Target, { isFocusable } from './internal/index';
import getElement from './internal/get-element';

export function __focus__(element: HTMLElement | Element | Document | SVGElement): void {
  const previousFocusedElement =
    document.activeElement &&
    document.activeElement !== element &&
    isFocusable(document.activeElement)
      ? document.activeElement
      : null;

  // fire __blur__ manually with the null relatedTarget when the target is not focusable
  // and there was a previously focused element
  if (!isFocusable(element)) {
    if (previousFocusedElement) {
      __blur__(previousFocusedElement, null);
    }

    return;
  }

  let browserIsNotFocused = document.hasFocus && !document.hasFocus();

  if (previousFocusedElement && browserIsNotFocused) {
    __blur__(previousFocusedElement, element);
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
  } else if (!isFocusable(element)) {
    throw new Error(`${element} is not focusable`);
  }

  __focus__(element);
}
