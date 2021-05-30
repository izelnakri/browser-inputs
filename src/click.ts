import Target, { isFormControl, isWindow } from './internal/index';
import getElement from './internal/get-element';
import { __focus__ } from './focus';
import fireEvent from './fire-event';

const PRIMARY_BUTTON = 1;
const MAIN_BUTTON_PRESSED = 0;

export const DEFAULT_CLICK_OPTIONS = {
  buttons: PRIMARY_BUTTON,
  button: MAIN_BUTTON_PRESSED,
};

export function __click__(element: Element | Document, options: MouseEventInit): void {
  fireEvent(element, 'mousedown', options);

  if (!isWindow(element)) {
    __focus__(element);
  }

  fireEvent(element, 'mouseup', options);
  fireEvent(element, 'click', options);
}

export default async function click(target: Target, _options: MouseEventInit = {}): Promise<void> {
  let options = Object.assign({}, DEFAULT_CLICK_OPTIONS, _options);

  if (!target) {
    throw new Error('Must pass an element or selector to `click`.');
  }

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`click('${target}')\`.`);
  } else if (isFormControl(element) && element.disabled) {
    throw new Error(`Can not \`click\` disabled ${element}`);
  }

  __click__(element, options);

  // return settled();
}
