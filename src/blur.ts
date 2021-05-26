import fireEvent from './fire-event';
import Target, { isFocusable } from './internal/index';
import getElement from './internal/get-element';

export function __blur__(
  element: HTMLElement | Element | Document | SVGElement,
  relatedTarget: HTMLElement | Element | Document | SVGElement | null = null
): void {
  if (!isFocusable(element)) {
    throw new Error(`${element} is not focusable`);
  }

  let browserIsNotFocused = document.hasFocus && !document.hasFocus();
  let needsCustomEventOptions = relatedTarget !== null;
  if (!needsCustomEventOptions) {
    // makes `document.activeElement` be `body`.
    // If the browser is focused, it also fires a blur event
    element.blur();
  }

  // Chrome/Firefox does not trigger the `blur` event if the window
  // does not have focus. If the document does not have focus then
  // fire `blur` event via native event.
  if (browserIsNotFocused || needsCustomEventOptions) {
    let options = { relatedTarget };
    fireEvent(element, 'blur', Object.assign({ bubbles: false }, options));
    fireEvent(element, 'focusout', options);
  }
}

/**
  Unfocus the specified target.

  Sends a number of events intending to simulate a "real" user unfocusing an
  element.

  The following events are triggered (in order):

  - `blur`
  - `focusout`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle unfocusing a given element.

  @public
  @param {string|Element} [target=document.activeElement] the element or selector to unfocus
  @return {Promise<void>} resolves when settled

  @example
  <caption>
    Emulating blurring an input using `blur`
  </caption>

  blur('input');
*/
export default async function blur(target: Target = document.activeElement!): Promise<void> {
  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`blur('${target}')\`.`);
  }

  __blur__(element);

  // return settled();
}
