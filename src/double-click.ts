import fireEvent from './fire-event';
import Target, { isFocusable, isFormControl } from './internal/index';
import getElement from './internal/get-element';
import { __focus__ } from './focus';
import { DEFAULT_CLICK_OPTIONS } from './click';

export function __doubleClick__(element: Element | Document, options: MouseEventInit): void {
  fireEvent(element, 'mousedown', options);

  if (isFocusable(element)) {
    __focus__(element);
  }

  fireEvent(element, 'mouseup', options);
  fireEvent(element, 'click', options);
  fireEvent(element, 'mousedown', options);
  fireEvent(element, 'mouseup', options);
  fireEvent(element, 'click', options);
  fireEvent(element, 'dblclick', options);
}

/**
  Double-clicks on the specified target.

  Sends a number of events intending to simulate a "real" user clicking on an
  element.

  Use the `options` hash to change the parameters of the [MouseEvents](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent).

  @example
  <caption>
    Emulating double clicking a button and pressing the `shift` key simultaneously using `click` with `options`.
  </caption>

  doubleClick('button', { shiftKey: true });
*/
export default async function doubleClick(
  target: Target,
  _options: MouseEventInit = {}
): Promise<void> {
  let options = Object.assign({}, DEFAULT_CLICK_OPTIONS, _options);

  if (!target) {
    throw new Error('Must pass an element or selector to `doubleClick`.');
  }

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`doubleClick('${target}')\`.`);
  } else if (isFormControl(element) && element.disabled) {
    throw new Error(`Can not \`doubleClick\` disabled ${element}`);
  }

  __doubleClick__(element, options);

  // return settled();
}
