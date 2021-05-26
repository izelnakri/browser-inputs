import Target, { isFormControl } from './internal/index';
import getElement from './internal/get-element';
import { __click__ } from './click';
import fireEvent from './fire-event';

export default async function tap(target: Target, options: object = {}): Promise<void> {
  if (!target) {
    throw new Error('Must pass an element or selector to `tap`.');
  }

  let element = getElement(target);
  if (!element) {
    throw new Error(`Element not found when calling \`tap('${target}')\`.`);
  } else if (isFormControl(element) && element.disabled) {
    throw new Error(`Can not \`tap\` disabled ${element}`);
  }

  let touchstartEv = fireEvent(element, 'touchstart', options);
  let touchendEv = fireEvent(element, 'touchend', options);

  if (!touchstartEv.defaultPrevented && !touchendEv.defaultPrevented) {
    __click__(element, options);
  }

  // return settled();
}
